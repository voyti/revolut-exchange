import { render, screen } from '@testing-library/react';
import { Currency } from '../../interfaces/Exchange';
import ExchangedCurrency from './ExchangedCurrency';

test('renders learn react link', () => {
  const currencies: Currency[] = [
    { currencyName: 'USD', currencySymbol: '$', amount: 134.54 },
    { currencyName: 'EUR', currencySymbol: '€', amount: 44.52 }
  ];
  const cb = () => {};

  render(<ExchangedCurrency currency={currencies[0]} value={'0'} onCurrencyPicked={cb}/>);
  const linkElement = screen.getByText(/You have .*/i);
  expect(linkElement).toBeInTheDocument();
});
