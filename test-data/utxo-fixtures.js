/**
 * UTXO Test Fixtures and Mock Data
 *
 * Comprehensive test data for UTXO fetching feature.
 * Supports both ES6 module imports and browser global fallback.
 */

// =============================================================================
// MOCK API RESPONSES
// =============================================================================

export const mockUtxoResponses = {
  // Scenario 1: Single UTXO (typical paper wallet)
  singleUtxo: {
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Genesis address
    data: [
      {
        txid: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
        vout: 0,
        status: {
          confirmed: true,
          block_height: 100000,
          block_hash: '000000000003ba27aa200b1cecaad478d2b00432346c3f1f3986da1afd33e506',
          block_time: 1293623863
        },
        value: 5000000000 // 50 BTC in satoshis
      }
    ]
  },

  // Scenario 2: Multiple UTXOs (multiple deposits scenario)
  multipleUtxos: {
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    data: [
      {
        txid: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
        vout: 0,
        status: {
          confirmed: true,
          block_height: 750000,
          block_hash: '00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054',
          block_time: 1659284924
        },
        value: 100000 // 0.001 BTC
      },
      {
        txid: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
        vout: 1,
        status: {
          confirmed: true,
          block_height: 750100,
          block_hash: '00000000000000000003b8c5d2f59e87d6b48a03276b381267c8b9e83839b165',
          block_time: 1659884924
        },
        value: 250000 // 0.0025 BTC
      },
      {
        txid: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
        vout: 2,
        status: {
          confirmed: true,
          block_height: 750200,
          block_hash: '00000000000000000004c9d6e3f0af98e7c59b14387c492378d9caf94940c276',
          block_time: 1660484924
        },
        value: 500000 // 0.005 BTC
      }
    ]
  },

  // Scenario 3: Unconfirmed UTXO
  unconfirmedUtxo: {
    address: '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy',
    data: [
      {
        txid: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
        vout: 0,
        status: {
          confirmed: false
        },
        value: 75000 // 0.00075 BTC
      }
    ]
  },

  // Scenario 4: No UTXOs (address with no funds)
  noUtxos: {
    address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    data: []
  },

  // Scenario 5: Many UTXOs (stress test - 15 UTXOs)
  manyUtxos: {
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    data: generateMockUtxos(15, 745000)
  },

  // Scenario 6: Testnet UTXO
  testnetUtxo: {
    address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
    data: [
      {
        txid: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
        vout: 0,
        status: {
          confirmed: true,
          block_height: 2400000,
          block_hash: '00000000000000b7ab6ce61eb6d571003fbe5fe892da4c9b740c49a07542462d',
          block_time: 1659284924
        },
        value: 1000000 // 0.01 TBTC
      }
    ]
  }
};

// =============================================================================
// REAL TEST ADDRESSES
// =============================================================================

export const testAddresses = {
  mainnet: {
    genesis: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Bitcoin genesis block
    // Well-known donation addresses (public, no privacy concern)
    wikileaks: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v',
    // Example Bech32 address
    bech32Example: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  },
  testnet: {
    // Example testnet addresses
    example1: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
    example2: 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7',
    // Testnet faucets for getting test coins
    faucets: [
      'https://bitcoinfaucet.uo1.net/',
      'https://testnet.help/en/btcfaucet/testnet',
      'https://coinfaucet.eu/en/btc-testnet/'
    ]
  }
};

// =============================================================================
// ERROR SCENARIOS
// =============================================================================

export const errorScenarios = {
  invalidAddresses: [
    '', // Empty string
    '   ', // Whitespace only
    'not-a-bitcoin-address', // Invalid format
    '1InvalidAddress!!!', // Invalid characters
    'bc1invalid', // Invalid Bech32
    '3' // Too short
  ],

  mockApiErrors: {
    notFound: {
      status: 404,
      statusText: 'Not Found',
      error: 'Address not found'
    },
    serverError: {
      status: 500,
      statusText: 'Internal Server Error',
      error: 'Server error occurred'
    },
    timeout: {
      status: 408,
      statusText: 'Request Timeout',
      error: 'Request timed out'
    },
    rateLimited: {
      status: 429,
      statusText: 'Too Many Requests',
      error: 'Rate limit exceeded'
    },
    badRequest: {
      status: 400,
      statusText: 'Bad Request',
      error: 'Invalid address format'
    }
  }
};

// =============================================================================
// VALIDATION TEST CASES
// =============================================================================

export const validationTestCases = {
  validAddresses: {
    // P2PKH (Pay to Public Key Hash) - starts with 1
    p2pkh: [
      '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      '1BoatSLRHtKNngkdXEeobR76b53LETtpyT'
    ],
    // P2SH (Pay to Script Hash) - starts with 3
    p2sh: [
      '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy',
      '342ftSRCvFHfCeFFBuz4xwbeqnDw6BGUey',
      '35hK24tcLEWcgNA4JxpvbkNkoAcDGqQPsP'
    ],
    // Bech32 (Native SegWit) - starts with bc1
    bech32: [
      'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
    ],
    // Testnet - starts with m, n, or tb1
    testnet: [
      'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
      'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7',
      'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn',
      'n1ZCYg9YXtB5XCZazLxSmPDa8iwJRZHhGx'
    ]
  },

  invalidAddresses: [
    '', // Empty
    '   ', // Whitespace
    'not-a-bitcoin-address', // Random string
    '1InvalidAddressWithBadChecksum', // Bad checksum
    'bc1invalid', // Invalid Bech32
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Ethereum address
    '3J98t1WpEZ', // Too short
    '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa1234567890', // Too long
    'bc2qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' // Wrong prefix
  ]
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate N mock UTXOs with random values
 * @param {number} count - Number of UTXOs to generate
 * @param {number} startBlockHeight - Starting block height (defaults to 700000)
 * @returns {Array} Array of mock UTXO objects
 */
export function generateMockUtxos(count, startBlockHeight = 700000) {
  const utxos = [];
  const baseTime = 1640000000; // Base timestamp (Dec 2021)

  for (let i = 0; i < count; i++) {
    // Generate pseudo-random but deterministic txid
    const txid = Array(64)
      .fill(0)
      .map((_, idx) => ((i * 7 + idx * 13) % 16).toString(16))
      .join('');

    // Random value between 10,000 and 1,000,000 satoshis
    const value = Math.floor(10000 + (i * 12345) % 990000);

    const blockHeight = startBlockHeight + i * 100;
    const blockTime = baseTime + i * 600; // 10 minutes apart

    utxos.push({
      txid,
      vout: i % 3, // Alternate between output indexes 0, 1, 2
      status: {
        confirmed: i % 7 !== 0, // Every 7th UTXO is unconfirmed
        ...(i % 7 !== 0 && {
          block_height: blockHeight,
          block_hash: `000000000000000000${(i * 11).toString(16).padStart(48, '0')}`,
          block_time: blockTime
        })
      },
      value
    });
  }

  return utxos;
}

/**
 * Get mock response for a given address
 * Useful for simulating API responses in tests
 * @param {string} address - Bitcoin address
 * @returns {Object|null} Mock UTXO response or null if not found
 */
export function getMockResponseForAddress(address) {
  // Search through all mock responses
  for (const mockResponse of Object.values(mockUtxoResponses)) {
    if (mockResponse.address === address) {
      return mockResponse.data;
    }
  }
  return null;
}

/**
 * Validate if an address is in the valid test cases
 * @param {string} address - Bitcoin address to validate
 * @returns {boolean} True if valid
 */
export function isValidTestAddress(address) {
  const { validAddresses } = validationTestCases;

  return Object.values(validAddresses)
    .flat()
    .includes(address);
}

/**
 * Validate if an address is in the invalid test cases
 * @param {string} address - Bitcoin address to validate
 * @returns {boolean} True if invalid
 */
export function isInvalidTestAddress(address) {
  return validationTestCases.invalidAddresses.includes(address);
}

// =============================================================================
// BROWSER GLOBAL FALLBACK
// =============================================================================

// Make available as browser global for dev console testing
if (typeof window !== 'undefined') {
  window.mockUtxoResponses = mockUtxoResponses;
  window.testAddresses = testAddresses;
  window.errorScenarios = errorScenarios;
  window.validationTestCases = validationTestCases;
  window.generateMockUtxos = generateMockUtxos;
  window.getMockResponseForAddress = getMockResponseForAddress;
  window.isValidTestAddress = isValidTestAddress;
  window.isInvalidTestAddress = isInvalidTestAddress;

  console.log('✓ UTXO test fixtures loaded. Access via window.mockUtxoResponses');
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  mockUtxoResponses,
  testAddresses,
  errorScenarios,
  validationTestCases,
  generateMockUtxos,
  getMockResponseForAddress,
  isValidTestAddress,
  isInvalidTestAddress
};
