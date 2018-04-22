import axios from 'axios';
import store from '@/store/store';

export default () => {
  return axios.create({
    baseURL: process.env.baseURL,
    headers: {
      Authorization: `Bearer ${store.state.token}`,
    },
  });
};
