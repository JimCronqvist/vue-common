import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import router from '@/router';
import { useAuthStore } from './store';

export default function(refreshUrl, loginFormUrl) {

  // Axios interceptor function that will be called to refresh the auth on failed request due to a 401 status code
  const refreshAuthLogic = failedRequest => axios.post(refreshUrl).then(response => {
    const authStore = useAuthStore();
    authStore.setData(response.data);
  }).catch(error => {
    console.warn('Could not refresh the token', error);
    if(loginFormUrl instanceof Function) {
      const authStore = useAuthStore();
      loginFormUrl({ router, authStore });
    } else {
      router.push(loginFormUrl);
    }
  });

  // Instantiate the interceptor (you can chain it as it returns the axios instance)
  createAuthRefreshInterceptor(axios, refreshAuthLogic, {
    pauseInstanceWhileRefreshing: true,
  });

  // Use interceptor to inject the Bearer Token from the store to the requests when one exists
  axios.interceptors.request.use(request => {
    const authStore = useAuthStore();
    const accessToken = authStore.getToken;
    if(accessToken !== null) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return request;
  });

}

export function tenantAuthInterceptor() {
  // Set up interceptor to append "?tenant=xyz" when it exists in the store
  axios.interceptors.request.use(request => {
    const authStore = useAuthStore();
    const tenant = authStore.tenant;
    if(tenant) {
      request.params = { ...request.params, tenant: tenant};
    }
    return request;
  });
}

export function apiUrlInterceptor() {
  // Set up interceptor to prepend the VITE_API_URL environment variable to the url when a relative url is used
  axios.interceptors.request.use(request => {
    if (!/^https?:\/\//i.test(request.url)) {
      request.url = (import.meta.env.VITE_API_URL || '') + request.url; // process.env.VITE_API_URL
    }
    return request;
  });
}
