const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');

// Initialize ECC library
bitcoin.initEccLib(ecc);

// Add ECPair functionality
const ECPair = require('ecpair').default(ecc);

// Extend bitcoin object with ECPair
bitcoin.ECPair = ECPair;

// Export the bitcoin library to global scope
if (typeof window !== 'undefined') {
    window.bitcoin = bitcoin;
}

// Also export for node/browserify
module.exports = bitcoin;