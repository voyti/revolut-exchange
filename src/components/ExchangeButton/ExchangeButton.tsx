import React, { useCallback } from 'react';
import './ExchangeButton.scss';
import { Currency } from '../../interfaces/Exchange';
import _ from 'lodash';
import { isCurrencyValueEmpty } from '../../store/utils';

interface ExchangeButtonProps {
  fromValue: string,
  toValue: string,
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

  const checkIfFundsSufficient = useCallback(() => {
    return Number(fromValue) <= fromCurrency.amount;
  }, [fromValue, fromCurrency]);

  const checkIfCurrenciesDifferent = useCallback(() => {
    return fromCurrency.currencyName !== toCurrency.currencyName;
  }, [fromCurrency, toCurrency]);

  const isInputsValueEmpty = useCallback(() => {
    return _.every([fromValue, toValue], isCurrencyValueEmpty);
  }, [fromValue, toValue])

  return (
    <button className="exchange-button"

      onClick={handleExchangeButtonClicked}
      disabled={isInputsValueEmpty() || !checkIfFundsSufficient() || !checkIfCurrenciesDifferent()}>

      <div className="exchange-button__main-label"> <img src="exchange_icon.svg" alt="Exchange icon"/>Exchange</div>

      <div className="exchange-button__sub-label">
        { !isInputsValueEmpty() && checkIfCurrenciesDifferent() && checkIfFundsSufficient() ?
          <span>You will get
            <span>{toCurrency.currencySymbol}{toValue}</span>for
            <span>{fromCurrency.currencySymbol}{fromValue}</span>
          </span> : null }

        { !isInputsValueEmpty() && checkIfCurrenciesDifferent() && !checkIfFundsSufficient() ?
          <span>You don't have sufficient funds
          </span> : null }

        { !isInputsValueEmpty() && !checkIfCurrenciesDifferent() ?
          <span>Please pick two different currencies
          </span> : null }
      </div>
  </button>
  );
}

export default ExchangeButton;
