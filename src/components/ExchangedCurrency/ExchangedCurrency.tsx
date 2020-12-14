import React from 'react';
import './ExchangedCurrency.scss';
import { Currency } from '../../interfaces/Exchange';
import { formatCurrency } from '../../store/utils';

interface ExchangedCurrencyProps {
  currency: Currency,
  value: number,
  isMoneySource?: boolean,
};

const ExchangedCurrency = ({ currency, value, isMoneySource }: ExchangedCurrencyProps) => {

  return (
    <div className="exchanged-currency">

      <div className="currency__value">
        {currency.currencyName}
      </div>

      <div className={`currency__wallet-info ${isMoneySource && value > currency.amount ? 'currency__wallet-info--insufficient' : ''}`}>
        You have {currency.currencySymbol}{formatCurrency(currency.amount)}
      </div>

    </div>
  );
}

export default ExchangedCurrency;
