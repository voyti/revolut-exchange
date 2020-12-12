import React from 'react';
import './ExchangedCurrency.scss';
import { Currency } from '../../interfaces/Exchange';

interface ExchangedCurrencyProps {
  currency: Currency,
};

const ExchangedCurrency = ({ currency }: ExchangedCurrencyProps) => {

  return (
    <div className="exchanged-currency">

      <div className="currency__value">
        {currency.currencyName}
      </div>

      <div className="currency__wallet-info">
        You have {currency.currencySymbol}{currency.amount}
      </div>

    </div>
  );
}

export default ExchangedCurrency;
