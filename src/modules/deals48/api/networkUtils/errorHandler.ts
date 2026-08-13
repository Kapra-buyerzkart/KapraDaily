import { AxiosError } from 'axios';

export const errorHandler = (error: AxiosError | any): never => {
  console.log('❌ [API ERROR]:', error?.response?.data || error?.message || error);

  if (error.message === 'Network Error') {
    throw 'Network Error. Ensure you are connected to internet.';
  }

  if (error.code === 'ECONNABORTED') {
    throw 'Server is not responding';
  }

  const status = error?.response?.status;
  const data = error?.response?.data as any;
  const message = data?.Message || 
                  data?.message || 
                  (data?.errors ? Object.values(data?.errors).flat().join(', ') : null);

  if (status === 401) {
    throw { Message: message || 'Unauthorized', status };
  }

  if (typeof message === 'string' && message.length > 0) {
    throw message;
  }

  throw 'Something went wrong.';
};
