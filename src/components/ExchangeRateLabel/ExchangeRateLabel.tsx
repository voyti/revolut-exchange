import React, { useCallback } from 'react';
import './ExchangeRateLabel.scss';
import { Currency, Rate } from '../../interfaces/Exchange';
import { areCurrenciesSame, formatCurrencyString, getCurrenciesExchangeRate } from '../../store/utils';

interface ExchangeRateLabelProps {
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: Rate[],
};

const ExchangeRateLabel = ({fromCurrency, toCurrency, rates }: ExchangeRateLabelProps) => {

  const checkIfCurrenciesDifferent = useCallback(
    () => {
    return areCurrenciesSame(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  const getUnitDisplayExchangeRate = useCallback(
    () => {
      if (rates.length) {
        return formatCurrencyString(getCurrenciesExchangeRate(fromCurrency.currencyName, toCurrency.currencyName, rates));
      } else {
        return 0;
      }
  }, [rates, fromCurrency, toCurrency]);

  return (
    <div className={`exchange-rate-label ${!checkIfCurrenciesDifferent() ? 'exchange-rate-label--hidden' : ''}`}>
      <span>{`1${fromCurrency.currencySymbol} = ${getUnitDisplayExchangeRate()}${toCurrency.currencySymbol}`} </span>
    </div>
  );
}

export default ExchangeRateLabel;
