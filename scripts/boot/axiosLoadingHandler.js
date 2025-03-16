import setupAxiosLoadingHandler from '../../packages/loading-handler';
import { useLoadingStore } from '../../stores/loading';

export default function (app, { $pinia, $http }) {
  const loadingStore = useLoadingStore($pinia);
  setupAxiosLoadingHandler($http, loadingStore);
}
