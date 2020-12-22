import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Currency } from '../../interfaces/Exchange';
import ExchangedCurrency from './ExchangedCurrency';

test('renders proper currency text and calls callback', () => {
  const currency: Currency = { currencyName: 'USD', currencySymbol: '$', amount: 10 };
  const value = '10';
  const handleCurrencyCycled = jest.fn();

  render(<ExchangedCurrency currency={currency} value={value} onCurrencyPicked={handleCurrencyCycled}/>);
  const linkElement = screen.getByText("You have $10");
  expect(linkElement).toBeInTheDocument();

  const nextButton = screen.getByAltText("Next currency");
  userEvent.click(nextButton);

  expect(handleCurrencyCycled).toHaveBeenCalledWith('next');
});
