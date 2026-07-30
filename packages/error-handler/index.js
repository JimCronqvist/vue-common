import { useSnackbarStore } from './store';

export function errorResponseHandler(error) {
  // Check for errorHandle config
  if(typeof error.config !== 'undefined' && Object.prototype.hasOwnProperty.call(error.config, 'errorHandle') && error.config.errorHandle === false) {
    return Promise.reject(error);
  }

  const snackbarStore = useSnackbarStore();
  let message;

  if (error.response) {
    // HTTP Errors 400/500
    message = error.response.data?.message || error.message;
  } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    // Timeouts
    message = 'Request timed out';
  } else if (error.request) {
    // General Network errors
    message = 'Network error';
  } else {
    // Unknown
    message = error.message;
  }

  snackbarStore.showMessage({
    message: message,
    color: "error",
    timeout: -1
  });

  return Promise.reject(error);
}

export default function setupAxiosErrorHandler(axios) {
  // Apply interceptor on response
  axios.interceptors.response.use(response => response, errorResponseHandler);
}
