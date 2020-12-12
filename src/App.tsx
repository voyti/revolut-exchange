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

  const [wallet] = useState(DEFAULT_WALLET);

  return (
    <div className="App">
      <header className="App-header">
        <div className="Title-container">
          <span className="Title Title-text">Exchange</span>
        </div>
      </header>

      <Exchange currencies={wallet}/>
    </div>
  );
}

export default App;
