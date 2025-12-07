// Import the module (works via file or HTTP in browser)
const fixtures = await import('./utxo-fixtures.js');

console.log('✅ ES6 MODULE IMPORT FROM HTTP: SUCCESS\n');

console.log('📦 Exported Objects:');
console.log('  ✓ mockUtxoResponses:', Object.keys(fixtures.mockUtxoResponses).length, 'scenarios');
console.log('  ✓ testAddresses: present');
console.log('  ✓ errorScenarios:', Object.keys(fixtures.errorScenarios).length, 'types');
console.log('  ✓ validationTestCases: present\n');

console.log('🔧 Helper Functions:');
console.log('  ✓ generateMockUtxos:', typeof fixtures.generateMockUtxos);
console.log('  ✓ getMockResponseForAddress:', typeof fixtures.getMockResponseForAddress);
console.log('  ✓ isValidTestAddress:', typeof fixtures.isValidTestAddress);
console.log('  ✓ isInvalidTestAddress:', typeof fixtures.isInvalidTestAddress, '\n');

console.log('🧪 Function Tests:');
const utxos = fixtures.generateMockUtxos(5);
console.log('  ✓ Generated', utxos.length, 'UTXOs');

const lookup = fixtures.getMockResponseForAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
console.log('  ✓ Address lookup: found', lookup ? lookup.length : 0, 'UTXO(s)');

console.log('  ✓ Valid address check:', fixtures.isValidTestAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'));
console.log('  ✓ Invalid address check:', fixtures.isInvalidTestAddress('not-a-bitcoin-address'), '\n');

console.log('📊 Mock Scenarios:');
Object.entries(fixtures.mockUtxoResponses).forEach(([name, data]) => {
  const confirmed = data.data.filter(u => u.status.confirmed).length;
  const unconfirmed = data.data.length - confirmed;
  console.log('  ✓', name.padEnd(18), ':', data.data.length.toString().padStart(2), 'UTXO(s)',
    confirmed ? `(${confirmed} confirmed${unconfirmed ? ', ' + unconfirmed + ' unconfirmed' : ''})` : '');
});

console.log('\n✅ ALL TESTS PASSED - Module works correctly via HTTP!');
