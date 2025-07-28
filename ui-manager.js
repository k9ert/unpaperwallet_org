/**
 * UI Management for Bitcoin Paper Wallet Transaction Creator
 */

// Global state variables
let isOnline = navigator.onLine;
let testMode = false;

// DOM elements
let statusIndicator, statusText, testModeToggle, transactionForm, createTxBtn;
let txidInput, voutInput, privateKeyInput, targetAddressInput, amountInput, feeInput;

// Initialize DOM references
function initializeUI() {
    statusIndicator = document.getElementById('status-indicator');
    statusText = document.getElementById('status-text');
    testModeToggle = document.getElementById('test-mode');
    transactionForm = document.getElementById('transaction-form');
    createTxBtn = document.getElementById('create-tx-btn');

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
    const inputs = [txidInput, voutInput, privateKeyInput, targetAddressInput, amountInput, feeInput];
    
    inputs.forEach(input => {
        input.disabled = !shouldEnable;
    });

    createTxBtn.disabled = !shouldEnable;
    
    if (shouldEnable) {
        validateForm();
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
