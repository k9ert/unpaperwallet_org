const bitcoin = require('bitcoinjs-lib');

// Export the bitcoin library to global scope
if (typeof window !== 'undefined') {
    window.bitcoin = bitcoin;
}

// Also export for node/browserify
module.exports = bitcoin;