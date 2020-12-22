class RateNotFoundError extends Error {
  constructor(rateName?: string | undefined) {
    super(`Cannot find rate for currency: ${rateName}`);
    Error.captureStackTrace(this, RateNotFoundError);
  }
}

class IncorrectRatesError extends Error {
  constructor() {
    super('Incorrect rates - the rate value can\'t be zero');
    Error.captureStackTrace(this, IncorrectRatesError);
  }
}

class RatesListEmptyError extends Error {
  constructor() {
    super('Cannot calculate rates: Rates list is empty');
    Error.captureStackTrace(this, RatesListEmptyError);
  }
}

class InvalidFormattingAttemptError extends Error {
  constructor(typeMismatchDescription: string) {
    super(`Trying to format ${typeMismatchDescription}`);
    Error.captureStackTrace(this, InvalidFormattingAttemptError);
  }
}


export {
  RateNotFoundError,
  IncorrectRatesError,
  RatesListEmptyError,
  InvalidFormattingAttemptError,
};
