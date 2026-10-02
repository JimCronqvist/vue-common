
export default function setupAxiosLoadingHandler(axios, loadingStore) {
  // Before a request is made set the store as loading
  axios.interceptors.request.use(config => {
    loadingStore.startLoading();
    return config;
  });

  // Before a response is returned set the store as not loading
  axios.interceptors.response.use(response => {
    loadingStore.stopLoading();
    return response;
  }, error => {
    loadingStore.stopLoading();
    return Promise.reject(error);
  });
};
