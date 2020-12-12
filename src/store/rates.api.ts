import axios from 'axios';
import { parseRates } from './utils';

const API_URL = 'https://openexchangerates.org/api/latest.json?app_id=cf351478f90b4f6b8cfc7b385949ff7a';

export const loadRatesApi = async () => {
  const response = await axios.get(`${API_URL}`);

  return parseRates(response);
};
