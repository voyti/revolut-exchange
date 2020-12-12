import { AxiosResponse } from "axios";
import _ from 'lodash';
import { Rate } from '../interfaces/Exchange';

const LOGGING_OUTPUT = window.console;

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

    return fromCurrency.rate / toCurrency.rate;

  } else {
    throw new Error('Cannot calculate rates: Rates list is empty');
  }
};

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

export { parseRates, getCurrenciesExchangeRate, getLoggingOutput, positiveNumberValidator };
