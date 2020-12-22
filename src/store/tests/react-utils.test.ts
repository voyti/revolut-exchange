
import { renderHook } from '@testing-library/react-hooks'
import { useInterval } from '../react-utils';

const POLLING_TIME = 100;

beforeEach(() => {
  jest.useFakeTimers();
})

afterEach(() => {
  jest.clearAllTimers();
});

test('should use setInterval function after proper time', () => {
  const cb = jest.fn();
  renderHook(() => useInterval(cb, POLLING_TIME));

  jest.runOnlyPendingTimers();

  expect(setInterval).toHaveBeenCalledTimes(1);
  expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), POLLING_TIME);
});

test('should call callback function after interval pass', () => {
  const cb = jest.fn();
  renderHook(() => useInterval(cb, POLLING_TIME));

  jest.runOnlyPendingTimers();

  expect(cb).toHaveBeenCalledTimes(1);
});

