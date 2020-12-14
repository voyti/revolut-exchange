import React from 'react';
import './ExchangeButton.scss';
import { Currency } from '../../interfaces/Exchange';

interface ExchangeButtonProps {
  fromValue: number,
  toValue: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  onExchangeButtonClicked: (inputChangeEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any | void,
};

const ExchangeButton = ({fromValue, toValue, fromCurrency, toCurrency, onExchangeButtonClicked }: ExchangeButtonProps) => {

  const handleExchangeButtonClicked = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (checkIfFundsSufficient()) {
      onExchangeButtonClicked(event);
    }
  };

  const checkIfFundsSufficient = () => {
    return fromValue <= fromCurrency.amount;
  }

  return (
    <button className="exchange-button"
      onClick={handleExchangeButtonClicked}
      disabled={!checkIfFundsSufficient()}>

      <div className="exchange-button__main-label"> <img src="exchange_icon.svg" alt="Exchange icon"/>Exchange</div>

      <div className="exchange-button__sub-label">

        { fromValue && toValue && checkIfFundsSufficient() ?
          <span>You will get
            <span>{toCurrency.currencySymbol}{toValue}</span>for
            <span>{fromCurrency.currencySymbol}{fromValue}</span>
          </span> : null }

        { fromValue && toValue && !checkIfFundsSufficient() ?
          <span>You don't have sufficient funds
          </span> : null }
      </div>
  </button>
  );
}

export default ExchangeButton;
