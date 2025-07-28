/**
 * Bitcoin transaction creation and management
 */

// Create Bitcoin transaction
function createTransaction(txid, vout, privateKeyWIF, targetAddress, amount, fee) {
    try {
        // Validate inputs
        validateTransactionId(txid);
        const voutNum = validateUtxoIndex(vout);
        validatePrivateKey(privateKeyWIF);
        validateBitcoinAddress(targetAddress);
        const amountNum = validateAmount(amount);
        const feeNum = validateFee(fee);

        // Create Bitcoin transaction using TransactionBuilder (bitcoinjs-lib 5.x)
        if (typeof bitcoin !== 'undefined' && bitcoin.TransactionBuilder && bitcoin.ECPair) {
            // Create key pair from private key
            const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, bitcoin.networks.bitcoin);
            
            // Create transaction builder
            const txBuilder = new bitcoin.TransactionBuilder(bitcoin.networks.bitcoin);
            
            // Add input
            txBuilder.addInput(txid, voutNum);
            
            // Calculate output amount (input amount minus fee)
            const outputAmount = amountNum - feeNum;

            if (outputAmount <= 0) {
                throw new Error('Fee cannot be greater than or equal to the input amount');
            }

            // Add output
            txBuilder.addOutput(targetAddress, outputAmount);
            
            // Sign the input
            txBuilder.sign(0, keyPair);
            
            // Build the transaction
            const tx = txBuilder.build();
            const txHex = tx.toHex();
            
            return txHex;
        } else {
            throw new Error('Bitcoin library components not available. Required: TransactionBuilder, ECPair');
        }

    } catch (error) {
        console.error('Transaction creation error:', error);
        throw error;
    }
}

// Display the created transaction
function displayTransaction(txHex) {
    // Show transaction hex
    document.getElementById('tx-hex').textContent = txHex;

    // Generate QR code
    if (typeof QRCode !== 'undefined') {
        const qrPlaceholder = document.getElementById('qr-placeholder');
        qrPlaceholder.innerHTML = '<canvas id="qr-canvas"></canvas>';
        
        const qrCanvas = document.getElementById('qr-canvas');
        QRCode.toCanvas(qrCanvas, txHex, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function (error) {
            if (error) {
                console.error('QR code generation error:', error);
                qrPlaceholder.innerHTML = 'QR code generation failed<br>Use the hex above to broadcast';
            }
        });
    } else {
        document.getElementById('qr-placeholder').innerHTML = 
            'QR code library not available<br>Use the transaction hex above to broadcast';
    }

    // Show the transaction output section
    const transactionOutput = document.getElementById('transaction-output');
    transactionOutput.classList.remove('hidden');
    
    // Scroll to the output
    transactionOutput.scrollIntoView({ behavior: 'smooth' });
}

// Handle transaction form submission
function handleTransactionSubmit(event, isOnline, testMode) {
    event.preventDefault();
    
    if (!isOnline || testMode) {
        try {
            hideError();
            hideSuccess();
            
            // Get form values
            const txid = document.getElementById('txid').value.trim();
            const vout = parseInt(document.getElementById('vout').value);
            const privateKeyWIF = document.getElementById('private-key').value.trim();
            const targetAddress = document.getElementById('target-address').value.trim();
            const amount = parseInt(document.getElementById('amount').value);
            const fee = parseInt(document.getElementById('fee').value);

            // Create the transaction
            const txHex = createTransaction(txid, vout, privateKeyWIF, targetAddress, amount, fee);
            
            // Display the transaction
            displayTransaction(txHex);
            
            showSuccess('Bitcoin transaction created and signed successfully!');
            
        } catch (error) {
            showError(`Transaction creation failed: ${error.message}`);
        }
    } else {
        showError('Cannot create transaction while online. Please disconnect from the internet or enable test mode.');
    }
}
