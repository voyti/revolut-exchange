import { render, screen } from '@testing-library/react';
import { Currency } from '../../interfaces/Exchange';
import ExchangeButton from './ExchangeButton';

test('renders learn react link', () => {
  const currencies: Currency[] = [
    { currencyName: 'USD', currencySymbol: '$', amount: 134.54 },
    { currencyName: 'EUR', currencySymbol: '€', amount: 44.52 }
  ];
  const fromCurrency = currencies[0];
  const toCurrency = currencies[1];
  const fromValue = 0;
  const toValue = 0;
  const handleExchangeMade = () => {};

  render(<ExchangeButton
    fromValue={fromValue}
    toValue={toValue}
    fromCurrency={fromCurrency}
    toCurrency={toCurrency}
    onExchangeButtonClicked={handleExchangeMade} /> );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
