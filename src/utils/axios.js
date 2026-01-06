import axios from 'axios';
import toast from 'react-hot-toast';
import { HOST_API_KEY } from '../config-global';


const AxiosClient = async (args) => {
  const { toolkit, headers = {}, ...rest } = args;

  return axios({
    baseURL: `${HOST_API_KEY}`,
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage?.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : null,
      ...headers,
    },
  })
    .then((response) => toolkit.fulfillWithValue(response.data))
    .catch((error) => toolkit.rejectWithValue(error.response?.data || error.message || 'Something went wrong'));
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';

    console.error('Request failed:', errorMessage);

    toast.error(errorMessage, {
      position: 'top-right',
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      window.location.href = '/';
    }

    return Promise.reject((error.response && error.response.data) || { message: errorMessage });
  }
);

export default AxiosClient;
