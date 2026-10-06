import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function usePageQueryParam(name = 'page') {
  const route = useRoute();
  const router = useRouter();

  return computed({
    get() {
      const page = Number(route.query[name]);
      return Number.isInteger(page) && page > 0 ? page : 1;
    },
    set(page) {
      const query = { ...route.query };
      if (page > 1) {
        query[name] = String(page);
      } else {
        delete query[name];
      }
      router.replace({ query });
    },
  });
}
