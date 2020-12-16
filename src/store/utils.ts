import { AxiosResponse } from "axios";
import _ from 'lodash';
import { Currency, Rate } from '../interfaces/Exchange';

const LOGGING_OUTPUT = window.console;
const DECIMAL_CURRENCY_SEPARATOR = '.';
const MAX_ALLOWED_DECIMALS_IN_CURRENCY_STRING = 2;
const DEFAULT_EMPTY_CURRENCY_STRING_VALUE = '0';

const parseRates = (ratesResponse: AxiosResponse): Rate[] => {
  return _.map(ratesResponse.data.rates, (value, key) => ({
    rate: value,
    currencyName: key,
  }));
};

const getCurrenciesExchangeRate = (fromCurrencyName: string, toCurrencyName: string, rates: Rate[]) => {
  if (rates && rates.length) {
    const fromCurrency = _.find(rates, ['currencyName', fromCurrencyName]);
    const toCurrency = _.find(rates, ['currencyName', toCurrencyName]);

    if (_.isNil(fromCurrency)) {
      throw new Error(`Cannot find rate for currency: ${fromCurrencyName}`);
    }

    if (_.isNil(toCurrency)) {
      throw new Error(`Cannot find rate for currency: ${toCurrencyName}`);
    }

    if (toCurrency.rate === 0 || fromCurrency.rate === 0) {
      throw new Error('Incorrect rates - the rate value can\'t be zero');
    }

    return toCurrency.rate / fromCurrency.rate;

  } else {
    throw new Error('Cannot calculate rates: Rates list is empty');
  }
};


const areCurrenciesSame = (currencyA: Currency, currencyB: Currency) => {
  return currencyA.currencyName !== currencyB.currencyName;
}

const getLoggingOutput = () => {
  return LOGGING_OUTPUT;
}

const positiveNumberValidator = (numValue: number) => {
  if (_.isNaN(numValue)) {
    return false;
  } else if (numValue < 0) {
    return false;
  } else {
    return true;
  }
};

const formatCurrencyString = (currencyValue: string | number) => {
  let processedStringNumber = currencyValue.toString();
  const decimalPart = processedStringNumber.split(DECIMAL_CURRENCY_SEPARATOR)[1];

  if (_.isNaN(formatCurrencyString)) {
    throw new Error('Trying to format a NaN to a Currency string');
  }

  if (processedStringNumber === '') {
    processedStringNumber = DEFAULT_EMPTY_CURRENCY_STRING_VALUE;
  }

  // trim leading zeros
  if (processedStringNumber.length > 1) {
    processedStringNumber = processedStringNumber.replace(/^0+/g, '');
  }

  // trim excess decimals
  if (decimalPart && decimalPart.length > MAX_ALLOWED_DECIMALS_IN_CURRENCY_STRING) {
    return Number(processedStringNumber).toFixed(MAX_ALLOWED_DECIMALS_IN_CURRENCY_STRING).toString();
  } else {
    return processedStringNumber;
  }
};

export {
  parseRates,
  getCurrenciesExchangeRate,
  getLoggingOutput,
  positiveNumberValidator,
  formatCurrencyString,
  areCurrenciesSame
};
