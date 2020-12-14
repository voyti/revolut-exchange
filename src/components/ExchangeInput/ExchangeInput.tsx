import React from 'react';
import './ExchangeInput.scss';
import { Currency } from '../../interfaces/Exchange';
import _ from 'lodash';
import useState from 'react';


interface ExchangeInputProps {
  currency: Currency,
  inputValue: number,
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
        value={Number(inputValue).toString()}
        autoFocus={shouldAutoFocus}
        onChange={onInputChanged}
        />
    </span>
  );
}

export default ExchangeInput;
