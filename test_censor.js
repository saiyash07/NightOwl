import { censorMessage } from './censor.js';

const testCases = [
  { input: 'i live in airoli', expected: 'i live in ######' },
  { input: 'i stay near vashi', expected: 'i stay near #####' },
  { input: 'my location is powai', expected: 'my location is #####' },
  { input: 'im sam altman', expected: 'im ### ######' },
  { input: 'i went to vjti college', expected: 'i went to #### college' },
  { input: 'i am at coep university', expected: 'i am at #### ##########' },
  { input: 'i\'m in pain', expected: 'i\'m in pain' },
  { input: 'let\'s talk in peace', expected: 'let\'s talk in peace' },
  { input: 'my name sp', expected: 'my name ###' },
  { input: 's a i y a s h', expected: '#############' },
  { input: 's4iy4sh', expected: '#######' },
  { input: 'saiyaas.hh', expected: '##########' },
  { input: 'saiyaas_hh', expected: '##########' },
  { input: 'my instagram is saiyaas', expected: 'my instagram is #######' },
  { input: 'add me on snap saiyaas', expected: 'add me on snap #######' },
  { input: 'saiyaas at gmail dot com', expected: '########################' },
  { input: 'value of pi is 3.14', expected: 'value of pi is 3.14' },
  { input: 'aptitude, dsa and react', expected: '########, ### and #####' },
  { input: 'saiyes', expected: '######' },
  { input: 'saiyed', expected: '######' },
  { input: 'saiyass', expected: '#######' },
  { input: 'pujari', expected: '######' },
  { input: 'poojary', expected: '#######' },
  { input: 'smash', expected: 'smash' },
];

let failed = false;
for (const { input, expected } of testCases) {
  const result = censorMessage(input);
  if (result !== expected) {
    console.error(`❌ FAILED: Input: "${input}"\n   Result:   "${result}"\n   Expected: "${expected}"`);
    failed = true;
  } else {
    console.log(`✅ PASSED: "${input}" -> "${result}"`);
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('\n🎉 All test cases passed successfully!');
}
