/**
 * UI Management for Bitcoin Paper Wallet Transaction Creator
 */

// Global state variables
let isOnline = navigator.onLine;
let testMode = false;
let mockDataMode = false;
let currentUtxos = [];

// DOM elements
let statusIndicator, statusText, testModeToggle, mockDataModeToggle, mockModeContainer, transactionForm, createTxBtn, scanPrivateKeyBtn;
let txidInput, voutInput, privateKeyInput, targetAddressInput, amountInput, feeInput;
let sourceAddressInput, fetchUtxosBtn, utxoListDiv, fetchErrorDiv;

// Initialize DOM references
function initializeUI() {
    statusIndicator = document.getElementById('status-indicator');
    statusText = document.getElementById('status-text');
    testModeToggle = document.getElementById('test-mode');
    mockDataModeToggle = document.getElementById('mock-data-mode');
    mockModeContainer = document.getElementById('mock-mode-container');
    transactionForm = document.getElementById('transaction-form');
    createTxBtn = document.getElementById('create-tx-btn');
    scanPrivateKeyBtn = document.getElementById('scan-private-key-btn');

    // Form inputs
    txidInput = document.getElementById('txid');
    voutInput = document.getElementById('vout');
    privateKeyInput = document.getElementById('private-key');
    targetAddressInput = document.getElementById('target-address');
    amountInput = document.getElementById('amount');
    feeInput = document.getElementById('fee');

    // UTXO fetcher elements
    sourceAddressInput = document.getElementById('source-address');
    fetchUtxosBtn = document.getElementById('fetch-utxos-btn');
    utxoListDiv = document.getElementById('utxo-list');
    fetchErrorDiv = document.getElementById('fetch-error');
}

// Setup event listeners
function setupEventListeners() {
    // Network status events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test mode toggle
    testModeToggle.addEventListener('change', handleTestModeToggle);

    // Mock data mode toggle
    if (mockDataModeToggle) {
        mockDataModeToggle.addEventListener('change', handleMockDataModeToggle);
    }

    // Form submission
    transactionForm.addEventListener('submit', (event) => {
        handleTransactionSubmit(event, isOnline, testMode);
    });

    // Input validation
    const inputs = [txidInput, voutInput, privateKeyInput, targetAddressInput, amountInput, feeInput];
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateForm);
    });

    // Security warning on page unload
    window.addEventListener('beforeunload', function(event) {
        if (privateKeyInput.value.trim() !== '') {
            event.preventDefault();
            event.returnValue = 'You have entered sensitive information. Are you sure you want to leave?';
        }
    });

    // QR scan button
    scanPrivateKeyBtn.addEventListener('click', handleQRScan);

    // UTXO fetcher button
    fetchUtxosBtn.addEventListener('click', handleFetchUtxos);
}

// Handle online status
function handleOnline() {
    isOnline = true;
    updateConnectionStatus();
    updateFormState();
}

// Handle offline status
function handleOffline() {
    isOnline = false;
    updateConnectionStatus();
    updateFormState();
}

// Handle test mode toggle
function handleTestModeToggle() {
    testMode = testModeToggle.checked;

    // Show/hide mock mode toggle based on test mode
    if (mockModeContainer) {
        mockModeContainer.style.display = testMode ? 'flex' : 'none';

        // Reset mock mode when hiding
        if (!testMode && mockDataMode) {
            mockDataModeToggle.checked = false;
            mockDataMode = false;
        }
    }

    updateConnectionStatus();
    updateFormState();
}

// Handle mock data mode toggle
function handleMockDataModeToggle() {
    mockDataMode = mockDataModeToggle.checked;
    updateConnectionStatus();
}

// Update connection status display
function updateConnectionStatus() {
    if (testMode) {
        statusIndicator.className = 'status-indicator status-test';
        statusText.textContent = 'TEST MODE - Development Only';
    } else if (isOnline) {
        statusIndicator.className = 'status-indicator status-online';
        statusText.textContent = 'ONLINE - Inputs Disabled for Security';
    } else {
        statusIndicator.className = 'status-indicator status-offline';
        statusText.textContent = 'OFFLINE - Safe to Use';
    }
}

// Update form state based on connection and test mode
function updateFormState() {
    const shouldEnable = !isOnline || testMode;
    const nonPrivateInputs = [txidInput, voutInput, targetAddressInput, amountInput, feeInput];

    // Always enable non-private fields for pasting convenience
    nonPrivateInputs.forEach(input => {
        input.disabled = false;
    });

    // Always enable source address input for convenience
    sourceAddressInput.disabled = false;

    // Fetch button only works when online (or in test mode)
    fetchUtxosBtn.disabled = !isOnline && !testMode;

    // Only disable private key field when online (unless in test mode)
    privateKeyInput.disabled = !shouldEnable;

    // Always disable the submit button when online (unless in test mode)
    createTxBtn.disabled = !shouldEnable;

    // Enable/disable scan button based on connection status
    scanPrivateKeyBtn.disabled = !shouldEnable;

    if (shouldEnable) {
        validateForm();
    } else {
        // When online, show warning if any field has content
        const hasContent = nonPrivateInputs.some(input => input.value.trim() !== '');
        if (hasContent) {
            // Clear validation errors but don't enable submit
            hideError();
        }
    }
}

// Validate form inputs
function validateForm() {
    const inputs = [txidInput, voutInput, privateKeyInput, targetAddressInput, amountInput, feeInput];
    const shouldEnable = !isOnline || testMode;

    if (!shouldEnable) {
        createTxBtn.disabled = true;
        return;
    }

    // Check if all fields are filled
    const allFieldsFilled = inputs.every(input => input.value.trim() !== '');

    if (!allFieldsFilled) {
        createTxBtn.disabled = true;
        hideError();
        return;
    }

    // Validate specific fields
    try {
        // Validate transaction ID
        validateTransactionId(txidInput.value.trim());

        // Validate UTXO index
        validateUtxoIndex(voutInput.value);

        // Validate private key
        validatePrivateKey(privateKeyInput.value.trim());

        // Validate target address
        validateBitcoinAddress(targetAddressInput.value.trim());

        // Validate amounts
        validateAmount(amountInput.value);
        validateFee(feeInput.value);

        createTxBtn.disabled = false;
        hideError();
    } catch (error) {
        createTxBtn.disabled = true;
        showError(`Validation error: ${error.message}`);
    }
}

// Handle QR code scanning for private key
async function handleQRScan() {
    // Check if we have camera access
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError('Camera access not available in this browser');
        return;
    }

    try {
        // QrScanner is loaded globally via qr-scanner-wrapper.js module
        // Create video element for camera feed
        const video = document.createElement('video');
        video.style.width = '300px';
        video.style.height = '300px';
        video.setAttribute('playsinline', true);
        video.setAttribute('autoplay', true);
        video.setAttribute('muted', true);
        
        // Create modal for camera feed
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; justify-content: center;
            align-items: center; z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white; padding: 20px; border-radius: 10px;
            text-align: center;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = 'margin-top: 10px; padding: 10px 20px;';
        
        const statusDiv = document.createElement('div');
        statusDiv.textContent = 'Starting camera...';
        statusDiv.style.cssText = 'margin-bottom: 10px; font-weight: bold;';
        
        modalContent.appendChild(statusDiv);
        modalContent.appendChild(video);
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Initialize QR scanner
        const qrScanner = new QrScanner(video, (result) => {
            let qrData = null;
            
            // Handle different result formats
            if (typeof result === 'string') {
                qrData = result;
            } else if (result && result.data) {
                qrData = result.data;
            } else if (result && result.text) {
                qrData = result.text;
            } else if (result && result.content) {
                qrData = result.content;
            }
            
            if (qrData && qrData.trim()) {
                privateKeyInput.value = qrData.trim();
                validateForm();
                qrScanner.destroy();
                document.body.removeChild(modal);
                showSuccess('Private key scanned successfully!');
                setTimeout(hideSuccess, 2000);
            } else {
                statusDiv.textContent = 'QR code detected but no data - keep trying...';
                return;
            }
        });
        
        // Set canvas optimization
        qrScanner.setGrayscaleWeights(0.299, 0.587, 0.114, true);
        qrScanner.setInversionMode('both');
        
        // Start the camera
        await qrScanner.start();
        statusDiv.textContent = 'Camera ready - point at QR code';
        
        // Add event listener to close button
        closeBtn.addEventListener('click', () => {
            qrScanner.destroy();
            document.body.removeChild(modal);
        });
    } catch (error) {
        showError('QR scanning failed: ' + error.message);
        console.error('QR scan error:', error);
    }
}

// Handle UTXO fetching
async function handleFetchUtxos() {
    const address = sourceAddressInput.value.trim();

    if (!address) {
        showFetchError('Please enter a Bitcoin address');
        return;
    }

    hideFetchError();
    hideError();
    hideSuccess();

    // Show loading state
    const originalText = fetchUtxosBtn.textContent;
    fetchUtxosBtn.disabled = true;
    fetchUtxosBtn.textContent = 'Fetching...';

    try {
        // Fetch UTXOs from API (or mock data)
        const utxos = await fetchUTXOs(address, testMode, mockDataMode);

        if (utxos.length === 0) {
            showFetchError('No UTXOs found for this address');
            utxoListDiv.classList.add('hidden');
            currentUtxos = [];
        } else {
            currentUtxos = utxos;
            displayUtxoList(utxos);
            showSuccess(`Found ${utxos.length} UTXO${utxos.length > 1 ? 's' : ''}${mockDataMode ? ' (mock data)' : ''}`);
            setTimeout(hideSuccess, 3000);
        }
    } catch (error) {
        showFetchError(`Error fetching UTXOs: ${error.message}`);
        utxoListDiv.classList.add('hidden');
        currentUtxos = [];
    } finally {
        // Restore button state
        fetchUtxosBtn.disabled = !isOnline && !testMode;
        fetchUtxosBtn.textContent = originalText;
    }
}

// Display UTXO list in table format
function displayUtxoList(utxos) {
    // Calculate total value
    const totalValue = utxos.reduce((sum, utxo) => sum + utxo.value, 0);

    // Generate table HTML
    let html = `
        <h3>Found ${utxos.length} UTXO${utxos.length > 1 ? 's' : ''} (Total: ${formatSatoshis(totalValue)} sats)</h3>
        <table>
            <thead>
                <tr>
                    <th>Select</th>
                    <th>TxID</th>
                    <th>Index</th>
                    <th>Amount (sats)</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    utxos.forEach((utxo, index) => {
        const isConfirmed = utxo.status.confirmed;
        const statusText = isConfirmed ? 'Confirmed' : 'Unconfirmed';
        const statusClass = isConfirmed ? 'status-confirmed' : 'status-unconfirmed';

        html += `
            <tr class="utxo-row" data-index="${index}">
                <td><input type="radio" name="utxo-select" value="${index}"></td>
                <td class="txid-short" title="${utxo.txid}">${shortenTxid(utxo.txid)}</td>
                <td>${utxo.vout}</td>
                <td>${formatSatoshis(utxo.value)}</td>
                <td class="${statusClass}">${statusText}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <button type="button" class="button button-success" id="use-selected-utxo-btn">
            Use Selected UTXO
        </button>
    `;

    utxoListDiv.innerHTML = html;
    utxoListDiv.classList.remove('hidden');

    // Attach event handlers
    const rows = utxoListDiv.querySelectorAll('.utxo-row');
    rows.forEach(row => {
        row.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;

            // Remove selected class from all rows
            rows.forEach(r => r.classList.remove('selected'));
            // Add selected class to this row
            this.classList.add('selected');
        });
    });

    // Attach handler to "Use Selected" button
    const useBtn = document.getElementById('use-selected-utxo-btn');
    useBtn.addEventListener('click', handleUseSelectedUtxo);
}

// Handle using selected UTXO
function handleUseSelectedUtxo() {
    const selectedRadio = utxoListDiv.querySelector('input[name="utxo-select"]:checked');

    if (!selectedRadio) {
        showFetchError('Please select a UTXO first');
        return;
    }

    const index = parseInt(selectedRadio.value);
    const utxo = currentUtxos[index];

    // Auto-fill form fields
    txidInput.value = utxo.txid;
    voutInput.value = utxo.vout;
    amountInput.value = utxo.value;

    // Validate the form
    validateForm();

    // Scroll to transaction form
    const formHeading = document.querySelector('.form-column h2:nth-of-type(2)');
    if (formHeading) {
        formHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Show success message
    showSuccess(`UTXO selected: ${formatSatoshis(utxo.value)} sats from ${shortenTxid(utxo.txid)}`);
    setTimeout(hideSuccess, 5000);

    hideFetchError();
}

// Show fetch error
function showFetchError(message) {
    fetchErrorDiv.textContent = message;
    fetchErrorDiv.classList.remove('hidden');
}

// Hide fetch error
function hideFetchError() {
    fetchErrorDiv.classList.add('hidden');
}

// Initialize the application
function initializeApp() {
    console.log('Application initialized');

    // Re-assign bitcoin in case it wasn't loaded when declared
    if (typeof window.bitcoin !== 'undefined') {
        bitcoin = window.bitcoin;
    }

    console.log('Bitcoin library loaded:', typeof bitcoin !== 'undefined');
    console.log('QRCode library loaded:', typeof QRCode !== 'undefined');

    // Test Bitcoin library functionality
    testBitcoinLibrary();

    // Initialize UI components
    initializeUI();
    initializeUtils();

    updateConnectionStatus();
    setupEventListeners();
    updateFormState();
}
