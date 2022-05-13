import axios from 'axios';
import setupAxiosLoadingHandler from '../../packages/loading-handler';

export default function ({ app, store }) {

  setupAxiosLoadingHandler(axios, store);

}
