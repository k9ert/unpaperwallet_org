// Wrapper to load QR Scanner ES6 module and expose globally
import QrScanner from '../vendor/qr-scanner.min.js';

// Configure worker path
QrScanner.WORKER_PATH = new URL('../vendor/qr-scanner-worker.min.js', import.meta.url).href;

// Expose to global scope
window.QrScanner = QrScanner;
