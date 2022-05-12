import setupAuth from '../../packages/vue-auth';

export default async function () {

  // Attach a bearer token and apply the interceptor to handle refreshing of tokens
  // Make sure that this is added after the global error handler has been configured
  setupAuth('/api/auth/refresh', '/auth/login');

}
