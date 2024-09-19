import { tenantAuthInterceptor } from '../../packages/vue-auth';

export default function () {
  // Set up interceptor to append "?tenant=xyz" when it exists in the auth store
  tenantAuthInterceptor();
}
