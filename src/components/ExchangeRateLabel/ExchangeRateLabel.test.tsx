import { render, screen } from '@testing-library/react';
import { Currency, Rate } from '../../interfaces/Exchange';
import ExchangeRateLabel from './ExchangeRateLabel';

test('renders the currency label', () => {
  const currencies: Currency[] = [
    { currencyName: 'USD', currencySymbol: '$', amount: 10 },
    { currencyName: 'EUR', currencySymbol: '€', amount: 10 }
  ];

  const rates: Rate[] = [
    { currencyName: 'USD', rate: 1 },
    { currencyName: 'EUR', rate: 2 },
  ];
  const fromCurrency = currencies[0];
  const toCurrency = currencies[1];

  render(<ExchangeRateLabel fromCurrency={fromCurrency} toCurrency={toCurrency} rates={rates} /> );
  const linkElement = screen.getByText('1$ = 2€');
  expect(linkElement).toBeInTheDocument();
});
