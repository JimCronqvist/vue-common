import axios from 'axios'
import store from '@/store/';

function errorResponseHandler(error) {
    // Check for errorHandle config
    if(typeof error.config !== 'undefined' && Object.prototype.hasOwnProperty.call(error.config, 'errorHandle') && error.config.errorHandle === false) {
        return Promise.reject(error);
    }

    // If has response show the error
    if (error.response) {
        const message = error.response.data.message || error.message;
        store.dispatch("snackbar/showMessage", {
            message: message,
            color: "error",
            timeout: 0
        }).then().catch();
    }
    return Promise.reject(error);
}

// Apply interceptor on response
axios.interceptors.response.use(response => response, errorResponseHandler);

export default errorResponseHandler;
