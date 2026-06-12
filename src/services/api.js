import axios from 'axios';

const BASE_URL = 'https://wttr.in';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default api;