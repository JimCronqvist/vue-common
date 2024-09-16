import axios from 'axios';
import setupAxiosLoadingHandler from '../../packages/loading-handler';
import { useLoadingStore } from '../../stores/loading';

export default function ({ app, pinia }) {

  const loadingStore = useLoadingStore(pinia);
  setupAxiosLoadingHandler(axios, loadingStore);

}
