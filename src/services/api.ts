import axios from 'axios';
import { envProvider } from 'services/hooks/useEnv';

const baseURL = envProvider.ApiBaseUrl
const api = axios.create({
  baseURL
});

export default api;
