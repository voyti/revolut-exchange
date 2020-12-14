import React, { useCallback, useEffect, useState } from 'react';
import './Exchange.scss';
import { loadRatesApi } from '../../store/rates.api';
import { getCurrenciesExchangeRate, getLoggingOutput, positiveNumberValidator, formatCurrency } from '../../store/utils';
import { useInterval } from '../../store/react-utils';
import { Currency, Rate } from '../../interfaces/Exchange';
import ExchangeInput from '../ExchangeInput/ExchangeInput';
import ExchangedCurrency from '../ExchangedCurrency/ExchangedCurrency';
import ErrorBox from '../ErrorBox/ErrorBox';
import ExchangeButton from '../ExchangeButton/ExchangeButton';

const RATES_POLLING_INTERVAL_MS = 10000;
const ERROR_DISPLAY_PERIOD_MS = 5000;
const ERROR_MESSAGE =  'Whops, we\'re having some issues right now. Please try again later';

type DependentValuePointerType = 'toValue' | 'fromValue';
interface ExchangeProps {
  currencies: Currency[],
  onExchangeMade: (updatedCurrencies: Currency[], updatedValues: number[]) => boolean,
};

const Exchange = ({ currencies, onExchangeMade }: ExchangeProps) => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);
  const [fromValue, setFromValue] = useState<number>(0);
  const [toValue, setToValue] = useState<number>(0);
  const [dependentValuePointer, setDependentValuePointer] = useState<DependentValuePointerType>('toValue');
  const [currentError, setCurrentError] = useState('');
  const loggingOutput = getLoggingOutput();

  const getRecalculatedExchangeValue = useCallback(
    (controllingExchangeValue: number, controllingCurrencyName: string, dependentCurrencyName: string) => {
      const exchangeRate = getCurrenciesExchangeRate( controllingCurrencyName, dependentCurrencyName, rates);
      return formatCurrency(controllingExchangeValue * exchangeRate);
    }, [rates]
  );


  const calculateAndSetDependentValue = useCallback(
    () => {
      if (dependentValuePointer && dependentValuePointer === 'fromValue' && toValue) {
        setFromValue(getRecalculatedExchangeValue(toValue, toCurrency.currencyName, fromCurrency.currencyName));
      } else if (dependentValuePointer && dependentValuePointer === 'toValue' && fromValue) {
        setToValue(getRecalculatedExchangeValue(fromValue, fromCurrency.currencyName, toCurrency.currencyName));
      }
    }, [dependentValuePointer, fromValue, toValue, fromCurrency.currencyName, toCurrency.currencyName, getRecalculatedExchangeValue]
  );

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

  useEffect(() => {
    calculateAndSetDependentValue();
  }, [calculateAndSetDependentValue, fromValue, toValue]);

  const handleFromCurrencyInputChanged = (inputChangeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(inputChangeEvent.target.value);
    if (!positiveNumberValidator(inputValue)) return;

    try {
      setFromValue(inputValue);
      setDependentValuePointer('toValue');
      console.log('SETTING AS DEPENDENT: toValue');
    } catch (error) {
      handleError(error, ERROR_MESSAGE);
    }
  }

  const handleToCurrencyInputChanged = (inputChangeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(inputChangeEvent.target.value);
    if (!positiveNumberValidator(inputValue)) return;

    try {
      setToValue(inputValue);
      setDependentValuePointer('fromValue');
      console.log('SETTING AS DEPENDENT: fromValue');
    } catch (error) {
      handleError(error, ERROR_MESSAGE);
    }
  }

  const handleExchangeMade = () => {
    if (onExchangeMade([fromCurrency, toCurrency], [-fromValue, toValue])) {
      setFromValue(0);
      setToValue(0);
    }
  }

  return (
    <div className="exchange">
      {currentError ? <ErrorBox error={currentError}/> : null}

      <div className="exchange__top-part">
        <div className="exchange-operand">
          <ExchangedCurrency currency={fromCurrency} value={fromValue} isMoneySource={true} />

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

      <div className="divider">
        <div className="divider__chevron"></div>
        <div className="divider__chevron-border"></div>
      </div>

      <div className="exchange__bottom-part">
        <div className="exchange-operand">
          <ExchangedCurrency currency={toCurrency} value={toValue}  />

          <div className="exchange-operand__value-container exchange-value-text">
            {toValue ? <span>+</span>: null}
            {rates.length ?
              <ExchangeInput
                currency={toCurrency}
                inputValue={toValue}
                onInputChanged={handleToCurrencyInputChanged} />
              : null}
          </div>
        </div>

        <div className="exchange-button-container">
          { fromValue && toValue ?
            <ExchangeButton
              fromValue={fromValue}
              toValue={toValue}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              onExchangeButtonClicked={handleExchangeMade} /> : null }
        </div>
      </div>

    </div>
  );
}

export default Exchange;
