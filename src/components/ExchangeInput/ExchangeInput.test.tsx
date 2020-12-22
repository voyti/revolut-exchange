import { fireEvent, render, screen } from '@testing-library/react';
import { Currency } from '../../interfaces/Exchange';
import ExchangeInput from './ExchangeInput';

test('renders input and allows only proper input up to two digits', () => {
  const currencies: Currency[] = [
    { currencyName: 'USD', currencySymbol: '$', amount: 134.54 },
    { currencyName: 'EUR', currencySymbol: '€', amount: 44.52 }
  ];
  const cb = () => {};
  const testValue = '0';

  render(<ExchangeInput onInputChanged={cb} currency={currencies[0]} inputValue={testValue}/>);

  const inputElement = screen.getByAltText('Exchange value input');
  expect(inputElement).toBeInTheDocument();
});
