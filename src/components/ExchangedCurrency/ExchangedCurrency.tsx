import './ExchangedCurrency.scss';
import { Currency } from '../../interfaces/Exchange';
import { formatCurrencyString } from '../../store/utils';

declare type CurrencyChangeDirection = 'prev' | 'next';
interface ExchangedCurrencyProps {
  currency: Currency,
  value: string,
  isMoneySource?: boolean,
  onCurrencyPicked: (direction: CurrencyChangeDirection) => void,
};

const ExchangedCurrency = ({ currency, value, isMoneySource, onCurrencyPicked }: ExchangedCurrencyProps) => {

  return (
    <div className="exchanged-currency">
      <button onClick={() => onCurrencyPicked('next')}>
          <img src="chevron_left.svg" alt="Next currency"/>
        </button>

      <div className="exchanged-currency__currency-info">
        <div className="exchanged-currency__value">
          {currency.currencyName}
        </div>

        <div className={`exchanged-currency__wallet-info ${isMoneySource && Number(value) > currency.amount ? 'exchanged-currency__wallet-info--insufficient' : ''}`}>
          You have {currency.currencySymbol}{formatCurrencyString(currency.amount)}
        </div>
      </div>

      <button onClick={() => onCurrencyPicked('prev')}>
        <img src="chevron_right.svg" alt="Previous currency"/>
      </button>

    </div>
  );
}

export default ExchangedCurrency;
export type { CurrencyChangeDirection };