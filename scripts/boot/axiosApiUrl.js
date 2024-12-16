import { apiUrlInterceptor } from '../../packages/vue-auth';

export default function () {
  // Set up interceptor to prepend the VITE_API_URL environment variable to the url when a relative url is used
  apiUrlInterceptor();
}
