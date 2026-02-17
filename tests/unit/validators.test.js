const { validateName, parseAndValidatePrice } = require('../../src/ui/validators');

test('validateName', () => {
  expect(validateName('')).toBeTruthy();
  expect(validateName('  ')).toBeTruthy();
  expect(validateName('X')).toBeNull();
});

test('parseAndValidatePrice', () => {
  expect(parseAndValidatePrice('').error).toBeTruthy();
  expect(parseAndValidatePrice('abc').error).toBeTruthy();
  expect(parseAndValidatePrice('0').error).toBeTruthy();
  expect(parseAndValidatePrice('-1').error).toBeTruthy();
  const r1 = parseAndValidatePrice('10');
  expect(r1.error).toBeNull();
  expect(r1.price).toBe(10);
  const r2 = parseAndValidatePrice('10,5');
  expect(r2.error).toBeNull();
  expect(r2.price).toBe(10.5);
});
