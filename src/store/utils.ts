import { AxiosResponse } from "axios";
import _ from 'lodash';
import { Currency, Rate } from '../interfaces/Exchange';
import { IncorrectRatesError, InvalidFormattingAttemptError, RateNotFoundError, RatesListEmptyError } from "./exceptions";

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
      throw new RateNotFoundError(fromCurrencyName);
    }

    if (_.isNil(toCurrency)) {
      throw new RateNotFoundError(toCurrencyName);
    }

    if (toCurrency.rate <= 0 || fromCurrency.rate <= 0) {
      throw new IncorrectRatesError();
    }

    return toCurrency.rate / fromCurrency.rate;

  } else {
    throw new RatesListEmptyError();
  }
};

const areCurrenciesDifferent = (currencyA: Currency, currencyB: Currency) => {
  return currencyA.currencyName !== currencyB.currencyName;
}

const getLoggingOutput = () => {
  return LOGGING_OUTPUT;
}

const isCurrencyValueEmpty = (currencyValue: string) => {
  return currencyValue === DEFAULT_EMPTY_CURRENCY_STRING_VALUE;
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

  if (_.isNaN(currencyValue)) {
    throw new InvalidFormattingAttemptError('a NaN to a Currency string');
  }

  if (processedStringNumber === '') {
    processedStringNumber = DEFAULT_EMPTY_CURRENCY_STRING_VALUE;
  }

  // trim leading zeros
  if (processedStringNumber.length > 1) {
    processedStringNumber = _.trimStart(processedStringNumber, '0');
    processedStringNumber = processedStringNumber.length ? processedStringNumber : DEFAULT_EMPTY_CURRENCY_STRING_VALUE;
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
  areCurrenciesDifferent,
  isCurrencyValueEmpty,
};
