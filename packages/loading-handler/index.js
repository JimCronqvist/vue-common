
export default function setupAxiosLoadingHandler(axios, store) {
  // Before a request is made set the store as loading
  axios.interceptors.request.use(config => {
    store.commit('startLoading');
    return config;
  });

  // Before a response is returned set the store as not loading
  axios.interceptors.response.use(response => {
    store.commit('stopLoading');
    return response;
  }, error => {
    store.commit('stopLoading');
    return Promise.reject(error);
  });
};
