import {
  parseRates,
  getCurrenciesExchangeRate,
  getLoggingOutput,
  positiveNumberValidator,
  formatCurrencyString,
  areCurrenciesSame
} from '../utils';

test('has utils defined', () => {
  expect(parseRates).toBeDefined();
  expect(getCurrenciesExchangeRate,).toBeDefined();
  expect(getLoggingOutput,).toBeDefined();
  expect(positiveNumberValidator,).toBeDefined();
  expect(formatCurrencyString,).toBeDefined();
  expect(areCurrenciesSame).toBeDefined();
});
