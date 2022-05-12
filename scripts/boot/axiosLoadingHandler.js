import axios from 'axios';
import setupAxiosLoadingHandler from '../../packages/loading-handler';

export default async function ({ app, store }) {

  setupAxiosLoadingHandler(axios, store);

}
