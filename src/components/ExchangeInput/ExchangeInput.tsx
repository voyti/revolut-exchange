import React from 'react';
import './ExchangeInput.scss';
import { Currency } from '../../interfaces/Exchange';

interface ExchangeInputProps {
  currency: Currency,
  inputValue: string,
  onInputChanged: (inputChangeEvent: React.ChangeEvent<HTMLInputElement>) => any | void,
  shouldAutoFocus?: boolean,
};

const ExchangeInput = ({currency, inputValue, onInputChanged, shouldAutoFocus }: ExchangeInputProps) => {

  return (
    <span className="exchange-input">
      <input
        className="exchange-value-text"
        type="number"
        min="0"
        max={currency.amount}
        step="0.01"
        value={inputValue}
        autoFocus={shouldAutoFocus}
        onChange={onInputChanged}
        />
    </span>
  );
}

export default ExchangeInput;
