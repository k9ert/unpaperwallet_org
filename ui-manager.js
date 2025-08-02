/**
 * UI Management for Bitcoin Paper Wallet Transaction Creator
 */

// Global state variables
let isOnline = navigator.onLine;
let testMode = false;

// DOM elements
let statusIndicator, statusText, testModeToggle, transactionForm, createTxBtn, scanPrivateKeyBtn;
let txidInput, voutInput, privateKeyInput, targetAddressInput, amountInput, feeInput;

// Initialize DOM references
function initializeUI() {
    statusIndicator = document.getElementById('status-indicator');
    statusText = document.getElementById('status-text');
    testModeToggle = document.getElementById('test-mode');
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
}

// Setup event listeners
function setupEventListeners() {
    // Network status events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test mode toggle
    testModeToggle.addEventListener('change', handleTestModeToggle);

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
    updateConnectionStatus();
    updateFormState();
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
        // Dynamically import QrScanner
        const { default: QrScanner } = await import('./qr-scanner.min.js');
        
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
