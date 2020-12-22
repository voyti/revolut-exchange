import React from 'react';
import { act, fireEvent, prettyDOM, render, screen, waitFor } from '@testing-library/react';
import Exchange from './Exchange';
import { Currency } from '../../interfaces/Exchange';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
let currencies: Currency[];
let fakeRates: Object;
let handleExchangeMade: jest.Mock<any, any>;
let expectedOutputCurrencies: Currency[];

const EXCHANGE_BUTTON_MATCHER = /^Exchange\sicon.*/;
const EXCHANGE_INPUT_DISPLAY_VALUE = '0';
const EXCHANGE_CYCLE_NEXT_BUTTON_ALT = 'Next currency';
const EXCHANGE_CONNECTION_ERROR_MESSAGE =  'Whops, we\'re having some issues right now. Please try again later';

beforeEach(() => {
  jest.useFakeTimers();
  handleExchangeMade = jest.fn();

  currencies = [
    { currencyName: 'USD', currencySymbol: '$', amount: 10 },
    { currencyName: 'EUR', currencySymbol: '€', amount: 10 },
    { currencyName: 'GBP', currencySymbol: '£', amount: 10 },
  ];

  fakeRates = {
    data: {
      'base': 'USD',
      'rates': {
        'USD': 1,
        'EUR': 3,
        'GBP': 2,
      }
    }
  };

  expectedOutputCurrencies = [
    {amount: 10, currencyName: 'USD', currencySymbol: '$'},
    {amount: 10, currencyName: 'EUR', currencySymbol: '€'}
  ];
});

afterAll(() => {
  jest.unmock('axios');
  jest.clearAllTimers();
});



// local black box end-to-end/integration tests of Exchange component, it's children components and callback
test('receives rates, allows to type in value and perform exchange and then properly uses callback response', async () => {
  const expectedOutputValues = [-10, 30];

  mockedAxios.get.mockReturnValueOnce(Promise.resolve(fakeRates));
  render(<Exchange currencies={currencies} onExchangeMade={handleExchangeMade}/>);

  let inputCandidates: HTMLElement[];

  await waitFor(() => {
    inputCandidates = screen.getAllByDisplayValue(EXCHANGE_INPUT_DISPLAY_VALUE);
  });

  act(() => {
    const inputElement = inputCandidates[0];
    inputElement.focus();
    fireEvent.change(inputElement, { target: { value: '10' } });
  });

const exchangeButton = screen.getByRole('button', { name: EXCHANGE_BUTTON_MATCHER });
  userEvent.click(exchangeButton);

  expect(handleExchangeMade).toHaveBeenCalledWith(expectedOutputCurrencies, expectedOutputValues);
});



test('using from currency as dependent value', async () => {
  const expectedOutputValues = [-3.33, 10];

  mockedAxios.get.mockReturnValueOnce(Promise.resolve(fakeRates));
  render(<Exchange currencies={currencies} onExchangeMade={handleExchangeMade}/>);

  let inputCandidates: HTMLElement[];

  await waitFor(() => {
    inputCandidates = screen.getAllByDisplayValue(EXCHANGE_INPUT_DISPLAY_VALUE);
  });

  act(() => {
    const inputElement = inputCandidates[1];
    inputElement.focus();
    fireEvent.change(inputElement, { target: { value: '10' } });
  });

  const exchangeButton = screen.getByRole('button', { name: EXCHANGE_BUTTON_MATCHER });
  userEvent.click(exchangeButton);

  expect(handleExchangeMade).toHaveBeenCalledWith(expectedOutputCurrencies, expectedOutputValues);
});



test('cycling through currencies effects', async () => {
  const expectedOutputValues = [-6.67, 10];
  expectedOutputCurrencies = [
    {amount: 10, currencyName: 'GBP', currencySymbol: '£'},
    {amount: 10, currencyName: 'EUR', currencySymbol: '€'}
  ];

  mockedAxios.get.mockReturnValueOnce(Promise.resolve(fakeRates));
  render(<Exchange currencies={currencies} onExchangeMade={handleExchangeMade}/>);

  let inputCandidates: HTMLElement[];

  await waitFor(() => {
    inputCandidates = screen.getAllByDisplayValue(EXCHANGE_INPUT_DISPLAY_VALUE);
  });

  const cycleCurrencyNextButtons = screen.getAllByAltText(EXCHANGE_CYCLE_NEXT_BUTTON_ALT);
  const topCycleCurrencyNextButton = cycleCurrencyNextButtons[0];
  fireEvent.click(topCycleCurrencyNextButton);

  const exchangeButton = screen.getByRole('button', { name: EXCHANGE_BUTTON_MATCHER });
  expect(exchangeButton).toBeDisabled();

  fireEvent.click(topCycleCurrencyNextButton);

  act(() => {
    const inputElement = inputCandidates[1];
    inputElement.focus();
    fireEvent.change(inputElement, { target: { value: '10' } });
  });

  fireEvent.click(exchangeButton);
  expect(handleExchangeMade).toHaveBeenCalledWith(expectedOutputCurrencies, expectedOutputValues);
});



xtest('handling connection errors', async () => {
  mockedAxios.get.mockReturnValueOnce(Promise.reject());
  try {
    render(<Exchange currencies={currencies} onExchangeMade={handleExchangeMade}/>)
  } catch(e) {
    await waitFor(() => {
      const errorText = screen.getAllByAltText(EXCHANGE_CONNECTION_ERROR_MESSAGE);
      // eslint-disable-next-line jest/no-conditional-expect
      expect(errorText).toBeInTheDocument();
    });
  }
});