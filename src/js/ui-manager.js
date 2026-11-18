/**
 * UI Management for Bitcoin Paper Wallet Transaction Creator
 */

// Global state variables
const CONNECTIVITY_CHECK_URL = 'https://unpaperwallet.org/';
let connectionState = navigator.onLine ? 'checking' : 'offline';
let manuallyVerifiedOffline = false;
let connectivityCheckId = 0;
let testMode = false;
let mockDataMode = false;
let currentUtxos = [];
let batchUtxos = [];

// DOM elements
let statusIndicator, statusText, testModeToggle, mockDataModeToggle, mockModeContainer, transactionForm, createTxBtn, scanPrivateKeyBtn;
let scanSourceAddressBtn, scanTargetAddressBtn;
let offlineVerification, offlineConfirmCheckbox, offlineConfirmButton;
let txidInput, voutInput, privateKeyInput, targetAddressInput, amountInput, feeInput;
let sourceAddressInput, fetchUtxosBtn, utxoListDiv, fetchErrorDiv;
let batchSelectionSummary;

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
    scanSourceAddressBtn = document.getElementById('scan-source-address-btn');
    scanTargetAddressBtn = document.getElementById('scan-target-address-btn');
    offlineVerification = document.getElementById('offline-verification');
    offlineConfirmCheckbox = document.getElementById('offline-confirm-checkbox');
    offlineConfirmButton = document.getElementById('offline-confirm-btn');

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
    batchSelectionSummary = document.getElementById('batch-selection-summary');
}

// Setup event listeners
function setupEventListeners() {
    // Network status events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    offlineConfirmCheckbox.addEventListener('change', () => {
        offlineConfirmButton.disabled = !offlineConfirmCheckbox.checked;
    });
    offlineConfirmButton.addEventListener('click', confirmOfflineStatus);

    // Test mode toggle
    testModeToggle.addEventListener('change', handleTestModeToggle);

    // Mock data mode toggle
    if (mockDataModeToggle) {
        mockDataModeToggle.addEventListener('change', handleMockDataModeToggle);
    }

    // Form submission
    transactionForm.addEventListener('submit', (event) => {
        handleTransactionSubmit(event, connectionState !== 'offline', testMode, batchUtxos);
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
    scanSourceAddressBtn.addEventListener('click', () => handleAddressQRScan(sourceAddressInput));
    scanTargetAddressBtn.addEventListener('click', () => handleAddressQRScan(targetAddressInput));

    // UTXO fetcher button
    fetchUtxosBtn.addEventListener('click', handleFetchUtxos);
}

// Handle online status
function handleOnline() {
    manuallyVerifiedOffline = false;
    void checkInternetConnectivity();
}

// Handle offline status
function handleOffline() {
    connectivityCheckId++;
    connectionState = 'offline';
    manuallyVerifiedOffline = false;
    updateConnectionStatus();
    updateFormState();
}

// navigator.onLine can stay true when virtual adapters have no internet route.
async function checkInternetConnectivity() {
    const checkId = ++connectivityCheckId;
    if (!navigator.onLine) {
        handleOffline();
        return;
    }

    const wasManuallyVerifiedOffline = manuallyVerifiedOffline;
    connectionState = 'checking';
    updateConnectionStatus();
    updateFormState();

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    try {
        await fetch(CONNECTIVITY_CHECK_URL, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
            signal: controller.signal
        });
        if (checkId !== connectivityCheckId) return;
        connectionState = 'online';
        manuallyVerifiedOffline = false;
    } catch {
        if (checkId !== connectivityCheckId) return;
        connectionState = wasManuallyVerifiedOffline ? 'offline' : 'unknown';
        manuallyVerifiedOffline = wasManuallyVerifiedOffline;
    } finally {
        window.clearTimeout(timeout);
        if (checkId === connectivityCheckId) {
            updateConnectionStatus();
            updateFormState();
        }
    }
}

function confirmOfflineStatus() {
    if (connectionState !== 'unknown' || !offlineConfirmCheckbox.checked) return;
    connectionState = 'offline';
    manuallyVerifiedOffline = true;
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
    offlineVerification.classList.toggle('hidden', connectionState !== 'unknown');
    if (connectionState !== 'unknown') {
        offlineConfirmCheckbox.checked = false;
        offlineConfirmButton.disabled = true;
    }

    if (testMode) {
        statusIndicator.className = 'status-indicator status-test';
        statusText.textContent = 'TEST MODE - Development Only';
    } else if (connectionState === 'checking') {
        statusIndicator.className = 'status-indicator status-checking';
        statusText.textContent = 'CHECKING INTERNET CONNECTION - Inputs Disabled';
    } else if (connectionState === 'unknown') {
        statusIndicator.className = 'status-indicator status-unknown';
        statusText.textContent = 'CONNECTION UNVERIFIED - Private Key Locked';
    } else if (connectionState === 'online') {
        statusIndicator.className = 'status-indicator status-online';
        statusText.textContent = 'ONLINE - Inputs Disabled for Security';
    } else {
        statusIndicator.className = 'status-indicator status-offline';
        statusText.textContent = manuallyVerifiedOffline ? 'OFFLINE - Manually Verified' : 'OFFLINE - Safe to Use';
    }
}

// Update form state based on connection and test mode
function updateFormState() {
    const shouldEnable = connectionState === 'offline' || testMode;
    const nonPrivateInputs = [txidInput, voutInput, targetAddressInput, amountInput, feeInput];

    // Always enable non-private fields for pasting convenience
    nonPrivateInputs.forEach(input => {
        input.disabled = false;
    });
    if (batchUtxos.length) [txidInput, voutInput, amountInput].forEach(input => input.disabled = true);

    // Always enable source address input for convenience
    sourceAddressInput.disabled = false;

    // Fetch button only works when online (or in test mode)
    fetchUtxosBtn.disabled = connectionState === 'offline' && !testMode;

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
    const inputs = batchUtxos.length
        ? [privateKeyInput, targetAddressInput, feeInput]
        : [txidInput, voutInput, privateKeyInput, targetAddressInput, amountInput, feeInput];
    const shouldEnable = connectionState === 'offline' || testMode;

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
        // Validate private key
        validatePrivateKey(privateKeyInput.value.trim());

        // Validate target address
        validateBitcoinAddress(targetAddressInput.value.trim());

        const fee = validateFee(feeInput.value);
        if (batchUtxos.length) {
            const total = batchUtxos.reduce((sum, utxo) => sum + validateAmount(utxo.value), 0);
            if (total <= fee) throw new Error('Fee must be less than the combined UTXO amount');
        } else {
            validateTransactionId(txidInput.value.trim());
            validateUtxoIndex(voutInput.value);
            validateAmount(amountInput.value);
        }

        createTxBtn.disabled = false;
        hideError();
    } catch (error) {
        createTxBtn.disabled = true;
        showError(`Validation error: ${error.message}`);
    }
}

function handleAddressQRScan(input) {
    startQrScanner('Bitcoin address', (qrData) => {
        const address = qrData.replace(/^bitcoin:(?:\/\/)?/i, '').split('?')[0].trim();
        validateBitcoinAddress(address);
        input.value = address;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

async function startQrScanner(label, onScan) {
    if (!navigator.mediaDevices?.getUserMedia) {
        showError('Camera access not available in this browser');
        return;
    }
    if (typeof QrScanner === 'undefined') {
        showError('QR scanner is unavailable. Reload the page and try again.');
        return;
    }

    hideError();
    hideSuccess();

    const modal = document.createElement('div');
    modal.className = 'qr-scan-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', `Scan ${label}`);

    const dialog = document.createElement('div');
    dialog.className = 'qr-scan-dialog';
    const heading = document.createElement('h2');
    heading.textContent = `Scan ${label}`;
    const status = document.createElement('p');
    status.className = 'qr-scan-status';
    status.textContent = 'Starting camera...';
    const video = document.createElement('video');
    video.className = 'qr-scan-video';
    video.setAttribute('playsinline', '');
    video.muted = true;
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'button';
    closeButton.textContent = 'Close';
    dialog.append(heading, status, video, closeButton);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    let qrScanner;
    let closed = false;
    const close = () => {
        if (closed) return;
        closed = true;
        try { qrScanner?.destroy(); } catch {}
        modal.remove();
    };
    closeButton.addEventListener('click', close);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) close();
    });

    try {
        qrScanner = new QrScanner(video, (result) => {
            const data = (typeof result === 'string' ? result : result?.data || result?.text || '').trim();
            if (!data) return;
            try {
                onScan(data);
                close();
                showSuccess(`${label} scanned successfully!`);
                window.setTimeout(hideSuccess, 2000);
            } catch (error) {
                status.textContent = error.message || 'Invalid QR code. Keep scanning.';
            }
        });
        qrScanner.setGrayscaleWeights?.(0.299, 0.587, 0.114, true);
        qrScanner.setInversionMode?.('both');
        await qrScanner.start();
        if (!closed) status.textContent = `Camera ready - point at the ${label} QR code`;
    } catch (error) {
        close();
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            showError('Camera access denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            showError('Camera not available in this browser');
        } else {
            showError(`QR scanning failed: ${error.message}`);
        }
    }
}

// Handle QR code scanning for private key
function handleQRScan() {
    startQrScanner('Private key', (qrData) => {
        const privateKey = qrData.trim();
        validatePrivateKey(privateKey);
        privateKeyInput.value = privateKey;
        privateKeyInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
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
    currentUtxos = [];
    batchUtxos = [];
    batchSelectionSummary.classList.add('hidden');
    utxoListDiv.classList.add('hidden');
    updateFormState();

    // Show loading state
    const originalText = fetchUtxosBtn.textContent;
    fetchUtxosBtn.disabled = true;
    fetchUtxosBtn.textContent = 'Fetching...';

    try {
        // Fetch UTXOs from API (or mock data)
        const utxos = await fetchUTXOs(address, testMode, mockDataMode);

        if (utxos.length === 0) {
            showFetchError('No UTXOs found for this address');
        } else {
            currentUtxos = utxos;
            displayUtxoList(utxos);
            showSuccess(`Found ${utxos.length} UTXO${utxos.length > 1 ? 's' : ''}${mockDataMode ? ' (mock data)' : ''}`);
            setTimeout(hideSuccess, 3000);
        }
    } catch (error) {
        showFetchError(`Error fetching UTXOs: ${error.message}`);
    } finally {
        // Restore button state
        fetchUtxosBtn.disabled = connectionState === 'offline' && !testMode;
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
        <button type="button" class="button button-success" id="use-all-utxos-btn">
            Batch all ${utxos.length} UTXOs in one transaction
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
    document.getElementById('use-all-utxos-btn').addEventListener('click', handleUseAllUtxos);
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
    batchUtxos = [];
    batchSelectionSummary.classList.add('hidden');

    // Auto-fill form fields
    txidInput.value = utxo.txid;
    voutInput.value = utxo.vout;
    amountInput.value = utxo.value;

    updateFormState();
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

function handleUseAllUtxos() {
    if (!currentUtxos.length) return;
    batchUtxos = [...currentUtxos];
    const total = batchUtxos.reduce((sum, utxo) => sum + utxo.value, 0);
    const unconfirmed = batchUtxos.filter(utxo => !utxo.status.confirmed).length;
    txidInput.value = '';
    voutInput.value = '';
    amountInput.value = String(total);
    batchSelectionSummary.textContent = `${batchUtxos.length} UTXOs selected in one transaction. Total input: ${formatSatoshis(total)} sats; one fee is deducted.${unconfirmed ? ` ${unconfirmed} are unconfirmed.` : ''}`;
    batchSelectionSummary.classList.remove('hidden');
    updateFormState();
    validateForm();
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

    setupEventListeners();
    if (navigator.onLine) {
        void checkInternetConnectivity();
        window.setInterval(() => void checkInternetConnectivity(), 30000);
    } else {
        handleOffline();
    }
}
