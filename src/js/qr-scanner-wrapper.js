// Wrapper to load QR Scanner ES6 module and expose globally
import QrScanner from '../vendor/qr-scanner.min.js';

// Configure worker path
QrScanner.WORKER_PATH = '../vendor/qr-scanner-worker.min.js';

// Expose to global scope
window.QrScanner = QrScanner;
