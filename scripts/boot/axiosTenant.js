import { tenantAuthInterceptor } from '../../packages/vue-auth';

export default function (app, { $http, $pinia }) {
  // Set up interceptor to append "?tenant=xyz" when it exists in the auth store
  tenantAuthInterceptor({ axios: $http, pinia: $pinia });
}
