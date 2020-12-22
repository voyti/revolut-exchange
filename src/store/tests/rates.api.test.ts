import axios from 'axios';
import { loadRatesApi } from '../rates.api';
import * as Utils from '../utils';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
let fakeRates = {};

beforeEach(() => {
  fakeRates = {
    data: {
      'base': 'USD',
      'rates': {
        'AED': 3.672944,
        'AFN': 77.078739,
      }
    }
  }

});

afterAll(() => {
  jest.unmock('axios');
});

test('fetches the data and passes the response to parse logic', async () => {
  (Utils as any).parseRates = jest.fn().mockReturnValueOnce(true);

  mockedAxios.get.mockReturnValueOnce(Promise.resolve(fakeRates));
  const result = await loadRatesApi();

  expect(Utils.parseRates).toHaveBeenCalled();
  expect(result).toBe(true);
});




