import axios from 'axios';
import { parseRates } from './utils';

const API_URL = 'https://openexchangerates.org/api/latest.json?app_id=fda5fa4a36704f8fba1ee8ff9ba5db6c';

export const loadRatesApi = async () => {
  const response = await axios.get(`${API_URL}`);

  return parseRates(response);
};
