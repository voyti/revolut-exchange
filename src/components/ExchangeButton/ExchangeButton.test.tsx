import { render, screen } from '@testing-library/react';
import { Currency } from '../../interfaces/Exchange';
import ExchangeButton from './ExchangeButton';

let currencies: Currency[];
let fromCurrency: Currency;
let toCurrency: Currency;
let fromValue: string;
let toValue: string;
let handleExchangeMade = jest.fn();

beforeEach(() => {
  currencies = [
    { currencyName: 'USD', currencySymbol: '$', amount: 30 },
    { currencyName: 'EUR', currencySymbol: '€', amount: 10 }
  ];

  fromCurrency = currencies[0];
  toCurrency = currencies[1];
  fromValue = '30';
  toValue = '10';
  handleExchangeMade = jest.fn();
});

test('renders button text', () => {
  render(<ExchangeButton
    fromValue={fromValue}
    toValue={toValue}
    fromCurrency={fromCurrency}
    toCurrency={toCurrency}
    onExchangeButtonClicked={handleExchangeMade} /> );
  const buttonElement = screen.getByText(/Exchange/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders proper label text for correct exchange setup', () => {

  render(<ExchangeButton
    fromValue={fromValue}
    toValue={toValue}
    fromCurrency={fromCurrency}
    toCurrency={toCurrency}
    onExchangeButtonClicked={handleExchangeMade} /> );

  const exchangeLabelElement1 = screen.getByText(/You will get/);
  const exchangeLabelElement2 = screen.getByText(/€10/);
  const exchangeLabelElement3 = screen.getByText(/\$30/);

  expect(exchangeLabelElement1).toBeInTheDocument();
  expect(exchangeLabelElement2).toBeInTheDocument();
  expect(exchangeLabelElement3).toBeInTheDocument();
});

test('renders proper label text for insufficient funds', () => {
  currencies[0].amount = 10;

  render(<ExchangeButton
    fromValue={fromValue}
    toValue={toValue}
    fromCurrency={fromCurrency}
    toCurrency={toCurrency}
    onExchangeButtonClicked={handleExchangeMade} /> );

  const exchangeInsufficientLabelElement = screen.getByText('You don\'t have sufficient funds');
  expect(exchangeInsufficientLabelElement).toBeInTheDocument();
});

test('renders proper label text for same currencies', () => {
  toCurrency = currencies[0];

  render(<ExchangeButton
      fromValue={fromValue}
      toValue={toValue}
      fromCurrency={fromCurrency}
      toCurrency={toCurrency}
      onExchangeButtonClicked={handleExchangeMade} /> );

  const exchangeInsufficientLabelElement = screen.getByText('Please pick two different currencies');
  expect(exchangeInsufficientLabelElement).toBeInTheDocument();
});
