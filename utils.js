/**
 * Utility functions for Bitcoin Paper Wallet Transaction Creator
 */

// DOM element references
let errorMessage, successMessage;

// Initialize DOM references
function initializeUtils() {
    errorMessage = document.getElementById('error-message');
    successMessage = document.getElementById('success-message');
}

// Copy text to clipboard
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Transaction copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccess('Transaction copied to clipboard!');
    });
}

// Show error message
function showError(message) {
    if (!errorMessage) initializeUtils();
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
    errorMessage.scrollIntoView({ behavior: 'smooth' });
}

// Hide error message
function hideError() {
    if (!errorMessage) initializeUtils();
    errorMessage.classList.add('hidden');
}

// Show success message
function showSuccess(message) {
    if (!successMessage) initializeUtils();
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

// Hide success message
function hideSuccess() {
    if (!successMessage) initializeUtils();
    successMessage.classList.add('hidden');
}

// Reverse hex string for little endian
function reverseHex(hex) {
    return hex.match(/.{2}/g).reverse().join('');
}

// Validate transaction ID format
function validateTransactionId(txid) {
    if (!/^[a-fA-F0-9]{64}$/.test(txid)) {
        throw new Error('Transaction ID must be exactly 64 hexadecimal characters');
    }
    return true;
}

// Validate UTXO index
function validateUtxoIndex(vout) {
    const voutNum = parseInt(vout);
    if (isNaN(voutNum) || voutNum < 0) {
        throw new Error('UTXO index must be a non-negative number');
    }
    return voutNum;
}

// Validate private key format
function validatePrivateKey(privateKey) {
    if (typeof bitcoin !== 'undefined' && bitcoin.ECPair) {
        try {
            bitcoin.ECPair.fromWIF(privateKey);
        } catch (e) {
            throw new Error('Invalid private key format. Must be valid WIF format.');
        }
    } else {
        // Fallback basic validation
        if (privateKey.length < 51 || privateKey.length > 52) {
            throw new Error('Private key must be 51-52 characters long (WIF format)');
        }
        if (!/^[5KL]/.test(privateKey)) {
            throw new Error('Private key must start with 5, K, or L (WIF format)');
        }
    }
    return true;
}

// Validate Bitcoin address
function validateBitcoinAddress(address) {
    // Check for unsupported taproot addresses
    if (address.startsWith('bc1p')) {
        throw new Error('Taproot addresses (bc1p...) are not supported. Use legacy (1...) or native segwit (bc1...) addresses only.');
    }
    
    if (typeof bitcoin !== 'undefined' && bitcoin.address) {
        try {
            bitcoin.address.toOutputScript(address);
        } catch (e) {
            throw new Error('Invalid Bitcoin address format.');
        }
    } else {
        // Fallback basic validation for legacy and native segwit addresses
        if (address.length < 26 || address.length > 42) {
            throw new Error('Bitcoin address must be 26-42 characters long');
        }
        if (!/^[13]/.test(address) && !address.startsWith('bc1')) {
            throw new Error('Bitcoin address must start with 1, 3, or bc1');
        }
        // Validate native segwit addresses (but not taproot)
        if (address.startsWith('bc1') && !address.startsWith('bc1p') && address.length !== 42) {
            throw new Error('Native segwit addresses must be exactly 42 characters long');
        }
    }
    return true;
}

// Validate amount
function validateAmount(amount) {
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Amount must be a positive number');
    }
    return amountNum;
}

// Validate fee
function validateFee(fee) {
    const feeNum = parseInt(fee);
    if (isNaN(feeNum) || feeNum <= 0) {
        throw new Error('Fee must be a positive number');
    }
    return feeNum;
}

// Test Bitcoin library functionality
function testBitcoinLibrary() {
    if (typeof bitcoin === 'undefined') {
        console.error('Bitcoin library not loaded');
        return;
    }
    
    console.log('Bitcoin library methods available:');
    console.log('- address:', typeof bitcoin.address);
    console.log('- payments:', typeof bitcoin.payments);
    console.log('- Psbt:', typeof bitcoin.Psbt);
    console.log('- Transaction:', typeof bitcoin.Transaction);
    console.log('- TransactionBuilder:', typeof bitcoin.TransactionBuilder);
    console.log('- ECPair:', typeof bitcoin.ECPair);
    console.log('- networks:', typeof bitcoin.networks);
    console.log('- script:', typeof bitcoin.script);
    
    // Test basic functionality
    try {
        // Test address validation
        const testAddress = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';
        const outputScript = bitcoin.address.toOutputScript(testAddress);
        console.log('✓ Address validation works');
        
        // Test PSBT creation
        const psbt = new bitcoin.Psbt();
        console.log('✓ PSBT creation works');
        
        // Test network access
        const network = bitcoin.networks.bitcoin;
        console.log('✓ Network access works');
        
        console.log('Bitcoin library integration test: PASSED');
    } catch (error) {
        console.error('Bitcoin library integration test: FAILED', error);
    }
}

// Create a basic transaction hex (simplified demonstration)
function createTransactionHex(txid, vout, targetAddress, amount, fee) {
    // This creates a basic transaction structure for demonstration
    // In real Bitcoin transactions, you need proper signature creation and validation
    
    // Transaction version (4 bytes, little endian)
    const version = '01000000';
    
    // Input count (1 byte)
    const inputCount = '01';
    
    // Previous transaction hash (32 bytes, reversed)
    const prevTxHash = reverseHex(txid);
    
    // Previous output index (4 bytes, little endian)
    const prevOutputIndex = vout.toString(16).padStart(8, '0').match(/.{2}/g).reverse().join('');
    
    // Script length (1 byte) - empty for now
    const scriptLength = '00';
    
    // Sequence (4 bytes)
    const sequence = 'ffffffff';
    
    // Output count (1 byte)
    const outputCount = '01';
    
    // Output value (8 bytes, little endian)
    const outputValue = amount.toString(16).padStart(16, '0').match(/.{2}/g).reverse().join('');
    
    // Output script length (1 byte)
    const outputScriptLength = '19'; // 25 bytes for P2PKH
    
    // Output script (P2PKH: OP_DUP OP_HASH160 <pubkeyhash> OP_EQUALVERIFY OP_CHECKSIG)
    const outputScript = '76a914' + '0'.repeat(40) + '88ac'; // Placeholder pubkey hash
    
    // Lock time (4 bytes)
    const lockTime = '00000000';
    
    const txHex = version + inputCount + prevTxHash + prevOutputIndex + scriptLength + sequence + 
                 outputCount + outputValue + outputScriptLength + outputScript + lockTime;
    
    return txHex;
}

// Create a demo transaction hex for demonstration
function createDemoTransactionHex(txid, vout, targetAddress, amount) {
    // Create a basic transaction structure for demonstration
    return createTransactionHex(txid, vout, targetAddress, amount, 1000);
}
