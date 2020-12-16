import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import './Exchange.scss';
import { loadRatesApi } from '../../store/rates.api';
import { getCurrenciesExchangeRate, getLoggingOutput, positiveNumberValidator, areCurrenciesSame, formatCurrencyString } from '../../store/utils';
import { useInterval } from '../../store/react-utils';
import { Currency, Rate } from '../../interfaces/Exchange';
import ExchangeInput from '../ExchangeInput/ExchangeInput';
import ExchangedCurrency, { CurrencyChangeDirection } from '../ExchangedCurrency/ExchangedCurrency';
import ErrorBox from '../ErrorBox/ErrorBox';
import ExchangeButton from '../ExchangeButton/ExchangeButton';
import Divider from '../Divider/Divider';
import ExchangeRateLabel from '../ExchangeRateLabel/ExchangeRateLabel';

const RATES_POLLING_INTERVAL_MS = 10000;
const ERROR_DISPLAY_PERIOD_MS = 5000;
const ERROR_MESSAGE =  'Whops, we\'re having some issues right now. Please try again later';

const DEFAULT_FROM_CURRENCY_POINTER = 0;
const DEFAULT_TO_CURRENCY_POINTER = 1;

const DEFAULT_CURRENCY_STRING_VALUE = '0';

type DependentValuePointer = 'toValue' | 'fromValue';
interface ExchangeProps {
  currencies: Currency[],
  onExchangeMade: (updatedCurrencies: Currency[], updatedValues: number[]) => boolean,
};

const Exchange = ({ currencies, onExchangeMade }: ExchangeProps) => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [fromCurrencyPointer, setFromCurrencyPointer] = useState(DEFAULT_FROM_CURRENCY_POINTER);
  const [toCurrencyPointer, setToCurrencyPointer] = useState(DEFAULT_TO_CURRENCY_POINTER);

  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[fromCurrencyPointer]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[toCurrencyPointer]);

  const [fromValue, setFromValue] = useState<string>(DEFAULT_CURRENCY_STRING_VALUE);
  const [toValue, setToValue] = useState<string>(DEFAULT_CURRENCY_STRING_VALUE);

  const [dependentValuePointer, setDependentValuePointer] = useState<DependentValuePointer>('toValue');
  const [currentError, setCurrentError] = useState('');
  const loggingOutput = getLoggingOutput();

  const handleError = useCallback(
    (error: Error, errorMessage: any) => {
      loggingOutput.error(error);

      if (!currentError) {
        setCurrentError(errorMessage);

        window.setTimeout(() => {
          setCurrentError('');
        }, ERROR_DISPLAY_PERIOD_MS);
      }
    }, [loggingOutput, currentError]
  );

  const getRecalculatedExchangeValue = useCallback(
    (controllingExchangeValue: string, controllingCurrencyName: string, dependentCurrencyName: string) => {
      const exchangeRate = getCurrenciesExchangeRate( controllingCurrencyName, dependentCurrencyName, rates);
      try {
        return formatCurrencyString(Number(controllingExchangeValue) * exchangeRate);
      } catch(error) {
        handleError(error, ERROR_MESSAGE);
        return DEFAULT_CURRENCY_STRING_VALUE;
      }
    }, [rates, handleError]
  );

  const calculateAndSetDependentValue = useCallback(
    () => {
      if (dependentValuePointer === 'fromValue') {
        setFromValue(getRecalculatedExchangeValue(toValue, toCurrency.currencyName, fromCurrency.currencyName));

      } else if (dependentValuePointer === 'toValue') {
        setToValue(getRecalculatedExchangeValue(fromValue, fromCurrency.currencyName, toCurrency.currencyName));
      }
    }, [dependentValuePointer, fromValue, toValue, fromCurrency.currencyName, toCurrency.currencyName, getRecalculatedExchangeValue]
  );

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
  }, RATES_POLLING_INTERVAL_MS);

  useEffect(() => {
    if (rates.length) calculateAndSetDependentValue();
  }, [calculateAndSetDependentValue, fromValue, toValue, rates]);

  const handleFromCurrencyInputChanged = (inputChangeEvent: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrencyInputChanged(setFromValue, 'toValue', inputChangeEvent)
  }

  const handleToCurrencyInputChanged = (inputChangeEvent: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrencyInputChanged(setToValue, 'fromValue', inputChangeEvent)
  }

  const handleCurrencyInputChanged = (
    controllingValueSetter:  Dispatch<SetStateAction<string>>,
    dependentValuePointer: DependentValuePointer,
    inputChangeEvent: React.ChangeEvent<HTMLInputElement>) => {

    const inputValue = inputChangeEvent.target.value;
    if (!positiveNumberValidator(Number(inputValue))) return;

    try {
      const formattedStringCurrency = formatCurrencyString(inputValue);
      controllingValueSetter(formattedStringCurrency);
      setDependentValuePointer(dependentValuePointer);
    } catch (error) {
      handleError(error, ERROR_MESSAGE);
    }
  }

  const handleExchangeMade = () => {
    if (onExchangeMade([fromCurrency, toCurrency], [-Number(fromValue), Number(toValue)])) {
      setFromValue('0');
      setToValue('0');
    }
  }

  const handleFromCurrencyCycled = (direction: CurrencyChangeDirection) => {
    handleCurrencyCycled(fromCurrencyPointer, setFromCurrencyPointer, setFromCurrency, direction);
  }

  const handleToCurrencyCycled = (direction: CurrencyChangeDirection) => {
    handleCurrencyCycled(toCurrencyPointer, setToCurrencyPointer, setToCurrency, direction);
  }

  const handleCurrencyCycled = (
    currencyPointer: number,
    currencyPointerSetter: React.Dispatch<React.SetStateAction<number>>,
    cycledCurrencySetter: React.Dispatch<React.SetStateAction<Currency>>,
    direction: CurrencyChangeDirection) => {

    let nextCurrencyPointer = 0;
    if (direction === 'next') {
      nextCurrencyPointer = currencyPointer + 1;
    } else if (direction === 'prev') {
      nextCurrencyPointer = currencyPointer - 1;
    }
    currencyPointerSetter(nextCurrencyPointer);
    cycledCurrencySetter(currencies[Math.abs(nextCurrencyPointer % currencies.length)]);
  }

  const checkIfCurrenciesDifferent = useCallback(() => {
    return areCurrenciesSame(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  return (
    <div className="exchange">
      {currentError ? <ErrorBox error={currentError}/> : null}

      <div className="exchange__top-part">
        <div className="exchange-operand">
          <ExchangedCurrency currency={fromCurrency} value={fromValue} isMoneySource={true} onCurrencyPicked={handleFromCurrencyCycled}/>

          <div className="exchange-operand__value-container exchange-value-text">
            {fromValue ? <span>-</span> : null }
            {rates.length ?
              <ExchangeInput
                currency={fromCurrency}
                inputValue={fromValue}
                onInputChanged={handleFromCurrencyInputChanged}
                shouldAutoFocus={true}/> : null}
          </div>
        </div>
      </div>

      <ExchangeRateLabel fromCurrency={fromCurrency} toCurrency={toCurrency} rates={rates} />
      <Divider />

      <div className="exchange__bottom-part">
        <div className={`exchange-operand ${!checkIfCurrenciesDifferent() ? 'exchange-operand--dimmed' : ''}`}>
          <ExchangedCurrency currency={toCurrency} value={toValue} onCurrencyPicked={handleToCurrencyCycled} />

          <div className="exchange-operand__value-container exchange-value-text">
            {toValue ? <span>+</span>: null}
            {rates.length ?
              <ExchangeInput
                currency={toCurrency}
                inputValue={toValue}
                onInputChanged={handleToCurrencyInputChanged} /> : null}
          </div>
        </div>

        <div className='exchange-button-container'>
          <ExchangeButton
            fromValue={fromValue}
            toValue={toValue}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            onExchangeButtonClicked={handleExchangeMade} />
        </div>
      </div>

    </div>
  );
}

export default Exchange;
