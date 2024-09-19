import { useSnackbarStore } from './store';

export function errorResponseHandler(error) {
  // Check for errorHandle config
  if(typeof error.config !== 'undefined' && Object.prototype.hasOwnProperty.call(error.config, 'errorHandle') && error.config.errorHandle === false) {
    return Promise.reject(error);
  }

  // If the error has a response, show the error
  if (error.response) {
    const message = error.response.data.message || error.message;
    const snackbarStore = useSnackbarStore();
    snackbarStore.showMessage({
      message: message,
      color: "error",
      timeout: -1
    });
  }
  return Promise.reject(error);
}

export default function setupAxiosErrorHandler(axios) {
  // Apply interceptor on response
  axios.interceptors.response.use(response => response, errorResponseHandler);
}
