import { render, screen } from '@testing-library/react';
import { Currency } from '../../interfaces/Exchange';
import ExchangeInput from './ExchangeInput';

test('renders learn react link', () => {
  const currencies: Currency[] = [
    { currencyName: 'USD', currencySymbol: '$', amount: 134.54 },
    { currencyName: 'EUR', currencySymbol: '€', amount: 44.52 }
  ];
  const cb = () => {};

  render(<ExchangeInput onInputChanged={cb} currency={currencies[0]}/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
