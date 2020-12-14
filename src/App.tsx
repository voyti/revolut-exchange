import React, { useState } from 'react';
import './App.scss';
import Exchange from './components/Exchange/Exchange';
import { Currency } from './interfaces/Exchange';

const DEFAULT_WALLET: Currency[] = [
  { currencyName: 'USD', currencySymbol: '$', amount: 134.54 },
  { currencyName: 'EUR', currencySymbol: '€', amount: 44.52 },
  { currencyName: 'GBP', currencySymbol: '£', amount: 102.40 },
];
const App = () => {

  const [wallet, setWallet] = useState(DEFAULT_WALLET);

  const handleExchangeMade = (updatedCurrencies: Currency[], updatedValues: number[]) => {
    const updatedCurrencyNames = updatedCurrencies.map((currency) => currency.currencyName);
    const updatedWallet = wallet.map((currency) => {
      const updatedCurrencyIndex = updatedCurrencyNames.indexOf(currency.currencyName)
      if (updatedCurrencyIndex > -1) {
        currency.amount += updatedValues[updatedCurrencyIndex];
      }
      return currency;
    });

    setWallet(updatedWallet);
    return true;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="Title-container">
          <span className="Title Title-text">Exchange</span>
        </div>
      </header>

      <Exchange currencies={wallet} onExchangeMade={handleExchangeMade}/>
    </div>
  );
}

export default App;
