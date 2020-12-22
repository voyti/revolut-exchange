import { AxiosResponse } from 'axios';
import { Currency, Rate } from '../../interfaces/Exchange';
import { IncorrectRatesError, InvalidFormattingAttemptError, RateNotFoundError, RatesListEmptyError } from '../exceptions';

import {
  parseRates,
  getCurrenciesExchangeRate,
  getLoggingOutput,
  positiveNumberValidator,
  formatCurrencyString,
  areCurrenciesDifferent,
  isCurrencyValueEmpty
} from '../utils';


let FAKE_RATES_RESPONSE: { data: any };
let FAKE_RATES_PARSED: Rate[];

let FAKE_CURRENCY_A: Currency;
let FAKE_CURRENCY_B: Currency;

const AED_RATE = 3;
const AFN_RATE = 21;

const DEFAULT_EMPTY_CURRENCY_STRING_VALUE = '0';

beforeEach(() => {
  FAKE_RATES_RESPONSE = {
    data: {
      'base': 'USD',
      'rates': {
        'AED': AED_RATE,
        'AFN': AFN_RATE,
      }
    }
  };

  FAKE_RATES_PARSED = [{
    rate: AED_RATE,
    currencyName: 'AED',
  }, {
    rate: AFN_RATE,
    currencyName: 'AFN',
  }];

  FAKE_CURRENCY_A = {
    currencyName: 'A',
    currencySymbol: 'A',
    amount: 0,
  };

  FAKE_CURRENCY_B = {
    currencyName: 'B',
    currencySymbol: 'B',
    amount: 0,
  };

});

test('has utils defined', () => {
  expect(parseRates).toBeDefined();
  expect(getCurrenciesExchangeRate,).toBeDefined();
  expect(getLoggingOutput,).toBeDefined();
  expect(positiveNumberValidator,).toBeDefined();
  expect(formatCurrencyString,).toBeDefined();
  expect(areCurrenciesDifferent).toBeDefined();
  expect(isCurrencyValueEmpty).toBeDefined();
});

test('parseRates properly maps rates response', () => {
  expect(parseRates(FAKE_RATES_RESPONSE as AxiosResponse)).toStrictEqual(FAKE_RATES_PARSED);
});

test('parseRates doesn\'t mutate the input data', () => {
  const originalResponseString = JSON.stringify(FAKE_RATES_RESPONSE);
  parseRates(FAKE_RATES_RESPONSE as AxiosResponse);

  expect(JSON.stringify(FAKE_RATES_RESPONSE)).toStrictEqual(originalResponseString);
});



test('getCurrenciesExchangeRate properly rejects empty Rates input', () => {
  expect(
    () => getCurrenciesExchangeRate('AFN', 'AED', [])
  ).toThrowError(RatesListEmptyError);
});

test('getCurrenciesExchangeRate properly rejects currencies outside Rates list', () => {
  expect(() =>
    getCurrenciesExchangeRate('IDONTEXIST', 'AED', FAKE_RATES_PARSED)
  ).toThrowError(RateNotFoundError);
  expect(() =>
    getCurrenciesExchangeRate('AFN', 'IDONTEXIST', FAKE_RATES_PARSED)
  ).toThrowError(RateNotFoundError);
});

test('getCurrenciesExchangeRate properly rejects rates equal or less than zero', () => {
  FAKE_RATES_PARSED[0].rate = 0;
  expect(() =>
    getCurrenciesExchangeRate('AFN', 'AED', FAKE_RATES_PARSED)
  ).toThrowError(IncorrectRatesError);

  FAKE_RATES_PARSED[0].rate = -1123;
  expect(() =>
    getCurrenciesExchangeRate('AFN', 'AED', FAKE_RATES_PARSED)
  ).toThrowError(IncorrectRatesError);

});

test('getCurrenciesExchangeRate properly calculates rates', () => {
  expect(getCurrenciesExchangeRate('AFN', 'AED', FAKE_RATES_PARSED)).toStrictEqual(AED_RATE / AFN_RATE);
  expect(getCurrenciesExchangeRate('AED', 'AFN', FAKE_RATES_PARSED)).toStrictEqual(AFN_RATE / AED_RATE);
});



test('areCurrenciesDifferent properly compares Currencies', () => {
  expect(areCurrenciesDifferent(FAKE_CURRENCY_A, FAKE_CURRENCY_B)).toBe(true);
  expect(areCurrenciesDifferent(FAKE_CURRENCY_A, FAKE_CURRENCY_A)).toBe(false);
});



test('getLoggingOutput returns expected value', () => {
  expect(getLoggingOutput()).toBe(window.console);
});



test('isCurrencyValueEmpty returns expected value', () => {
  expect(isCurrencyValueEmpty('0')).toBe(true);
  expect(isCurrencyValueEmpty('1')).toBe(false);
});



test('positiveNumberValidator properly validates positive numbers', () => {
  expect(positiveNumberValidator(NaN)).toBe(false);
  expect(positiveNumberValidator(-3)).toBe(false);
  expect(positiveNumberValidator(10)).toBe(true);
  expect(positiveNumberValidator(Infinity)).toBe(true);
});



test('formatCurrencyString rejects NaN inputs', () => {
  expect(() => formatCurrencyString(NaN)).toThrowError(InvalidFormattingAttemptError);
});

test('formatCurrencyString defaults empty input', () => {
  expect(formatCurrencyString('')).toBe(DEFAULT_EMPTY_CURRENCY_STRING_VALUE);
});

test('formatCurrencyString properly trims leading zeros', () => {
  expect(formatCurrencyString('0')).toBe('0');
  expect(formatCurrencyString(0)).toBe('0');
  expect(formatCurrencyString('00')).toBe(DEFAULT_EMPTY_CURRENCY_STRING_VALUE);

  expect(formatCurrencyString('001')).toBe('1');
  expect(formatCurrencyString('00100010010')).toBe('100010010');
});

test('formatCurrencyString properly formats decimals', () => {
  expect(formatCurrencyString('12')).toBe('12');
  expect(formatCurrencyString('12.1')).toBe('12.1');
  expect(formatCurrencyString(12.1)).toBe('12.1');

  expect(formatCurrencyString(12.13)).toBe('12.13');
  expect(formatCurrencyString('12.13')).toBe('12.13');

  expect(formatCurrencyString(12.134)).toBe('12.13');
  expect(formatCurrencyString('12.134')).toBe('12.13');

  expect(formatCurrencyString(12.136)).toBe('12.14');
  expect(formatCurrencyString('12.136')).toBe('12.14');
});

