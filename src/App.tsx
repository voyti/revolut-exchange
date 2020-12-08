import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import Wallet from './Wallet/Wallet';
import Exchange from './Exchange/Exchange';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* {location} */}
        <div className="Avatar-container">
          <img src="./user.svg" alt="User avatar"></img>
        </div>
      </header>

      <Router>
        <div className="Menu">
          <nav>
            <ul>
              <li>
                <Link to="/wallet">Wallet</Link>
              </li>
              <li>
                <Link to="/exchange">Exchange</Link>
              </li>
            </ul>
          </nav>
        </div>

        <Switch>

          <Route exact path="/">
            <Redirect to={{ pathname: "/exchange" }} />
          </Route>

          <Route path="/wallet">
            <Wallet/>
          </Route>

          <Route path="/exchange">
            <Exchange/>
          </Route>

        </Switch>
      </Router>


    </div>
  );
}

export default App;
