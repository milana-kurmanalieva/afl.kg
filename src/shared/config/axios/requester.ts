import axios from 'axios';
import { getCookie } from 'cookies-next';
import { API_BASE, LANG_NAME } from '../../lib/constants/constants';


const windowOrigin = typeof window !== 'undefined' ? window.location.origin : API_BASE;
export const requester = axios.create({ baseURL: API_BASE ?? windowOrigin, withCredentials: true });


const localLang = getCookie(LANG_NAME);

requester.interceptors.request.use(config => {
  const token = getCookie('access_token');
  config.headers[ 'Accept-Language' ] = localLang ? localLang : 'ru';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
