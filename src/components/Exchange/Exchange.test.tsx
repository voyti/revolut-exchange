import React from 'react';
import { render, screen } from '@testing-library/react';
import Exchange from './Exchange';
import { Currency } from '../../interfaces/Exchange';

test('renders learn react link', () => {
  const currencies: Currency[] = [
    { currencyName: 'USD', currencySymbol: '$', amount: 134.54 },
    { currencyName: 'EUR', currencySymbol: '€', amount: 44.52 }
  ];

  render(<Exchange currencies={currencies} onExchangeMade={() => {return true}}/>);
  const linkElement = screen.getByText(/EUR/i);
  expect(linkElement).toBeInTheDocument();
});
