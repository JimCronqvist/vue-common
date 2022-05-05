import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import store from '@/store';
import router from '@/router';

export default function(refreshUrl, loginFormUrl) {

  // Axios interceptor function that will be called to refresh the auth on failed request due to a 401 status code
  const refreshAuthLogic = failedRequest => axios.post(refreshUrl).then(response => {
    return store.dispatch('auth/setData', response.data).then(() => Promise.resolve());
  }).catch(error => {
    router.push(loginFormUrl);
  });

  // Instantiate the interceptor (you can chain it as it returns the axios instance)
  createAuthRefreshInterceptor(axios, refreshAuthLogic, {
    pauseInstanceWhileRefreshing: true,
  });

  // Use interceptor to inject the Bearer Token from the store to the requests
  axios.interceptors.request.use(request => {
    const accessToken = store.getters['auth/getToken'];
    request.headers['Authorization'] = `Bearer ${accessToken}`;
    return request;
  });

}
