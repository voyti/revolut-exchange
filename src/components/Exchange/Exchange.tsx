import React, { useCallback, useEffect, useState } from 'react';
import './Exchange.scss';
import { loadRatesApi } from '../../store/rates.api';
import { getCurrenciesExchangeRate, getLoggingOutput, positiveNumberValidator } from '../../store/utils';
import { useInterval } from '../../store/react-utils';
import { Currency, Rate } from '../../interfaces/Exchange';
import ExchangeInput from '../ExchangeInput/ExchangeInput';
import ExchangedCurrency from '../ExchangedCurrency/ExchangedCurrency';
import ErrorBox from '../ErrorBox/ErrorBox';

const RATES_POLLING_INTERVAL_MS = 10000;
const ERROR_DISPLAY_PERIOD_MS = 5000;
const ERROR_MESSAGE =  'Whops, we have some issues right now. Please try again later';

interface ExchangeProps { currencies: Currency[] };

const Exchange = ({ currencies }: ExchangeProps) => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);
  const [fromValue, setFromValue] = useState<number>(0);
  const [toValue, setToValue] = useState<number>(0);
  const [dependentValue, setDependentValue] = useState<string | undefined>();
  const [currentError, setCurrentError] = useState('');

  const loggingOutput = getLoggingOutput();

  const getRecalculatedExchangeValue = useCallback(
    (controllingExchangeValue: number, controllingCurrencyName: string, dependentCurrencyName: string) => {
      const exchangeRate = getCurrenciesExchangeRate( controllingCurrencyName, dependentCurrencyName, rates);
      return formatDependentExchangeValue(controllingExchangeValue * exchangeRate);
    }, [rates]);


  const calculateAndSetDependentValue = useCallback(() => {
    if (dependentValue && dependentValue === 'fromValue' && toValue) {
      setFromValue(getRecalculatedExchangeValue(toValue, toCurrency.currencyName, fromCurrency.currencyName));
    } else if (dependentValue && dependentValue === 'toValue' && fromValue) {
      setToValue(getRecalculatedExchangeValue(fromValue, fromCurrency.currencyName, toCurrency.currencyName));
    }
  }, [dependentValue, fromValue, toValue, fromCurrency.currencyName, toCurrency.currencyName, getRecalculatedExchangeValue]);

  const handleError = useCallback((error: Error, errorMessage: any) => {
    loggingOutput.error(error);

    if (!currentError) {
      setCurrentError(errorMessage);

      window.setTimeout(() => {
        setCurrentError('');
      }, ERROR_DISPLAY_PERIOD_MS);
    }
  }, [loggingOutput, currentError]);


  const getAndProcessRates = useCallback(async () => {
    try {
      const rates = await loadRatesApi();
      setRates(rates);
    } catch (error) {
      handleError(error, ERROR_MESSAGE);
    }
  }, [handleError]);


  useEffect(() => {
    getAndProcessRates();
  }, []);

  useInterval(() => {
    getAndProcessRates();
    calculateAndSetDependentValue();
  }, RATES_POLLING_INTERVAL_MS);




  const formatDependentExchangeValue = (calculatedValue: number) => {
    return Number(calculatedValue.toFixed(2));
  };

  const handleFromCurrencyInputChanged = (inputChangeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(inputChangeEvent.target.value);
    if (!positiveNumberValidator(inputValue)) return;

    try {
      setFromValue(inputValue);
      setDependentValue('toValue');
      calculateAndSetDependentValue();
    } catch (error) {
      handleError(error, ERROR_MESSAGE);
    }
  }

  const handleToCurrencyInputChanged = (inputChangeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(inputChangeEvent.target.value);
    if (!positiveNumberValidator(inputValue)) return;

    try {
      setToValue(inputValue);
      setDependentValue('fromValue');
      calculateAndSetDependentValue();

    } catch (error) {
      handleError(error, ERROR_MESSAGE);
    }
  }

  const handleExchangeMade = () => {
    console.log('EXCHANGE MADE');
  }

  return (
    <div className="exchange">
      {currentError ? <ErrorBox error={currentError}/> : null}

      <div className="exchange__top-part">
        <div className="exchange-operand">
          <ExchangedCurrency currency={fromCurrency} />

          <div className="exchange-operand__value-container exchange-value-text">
            <ExchangeInput
              currency={fromCurrency}
              inputValue={fromValue}
              onInputChanged={handleFromCurrencyInputChanged}
              shouldAutoFocus={true}/>
          </div>
        </div>

      </div>

      <div className="divider">
        <div className="divider__chevron"></div>
        <div className="divider__chevron-border"></div>
      </div>

      <div className="exchange__bottom-part">
        <div className="exchange-operand">

          <ExchangedCurrency currency={toCurrency} />

          <div className="exchange-operand__value-container exchange-value-text">
            <ExchangeInput
              currency={toCurrency}
              inputValue={toValue}
              onInputChanged={handleToCurrencyInputChanged} />
          </div>
        </div>

        <div className="Submit-button-container" onClick={handleExchangeMade}>
          <button className="Submit-button">
            <img src="./../../public/exchange-icon.svg" alt="Exchange icon"/>
            <div className="Main-label">Exchange</div>
          </button>
        </div>
      </div>

    </div>
  );
}

export default Exchange;
