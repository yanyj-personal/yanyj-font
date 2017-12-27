import fetch from 'dva/fetch';
import { notification } from 'antd';
import config from '../config';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

// let firstFetch = true;
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  const defaultOptions = {
    credentials: 'credentials',
    mode: 'cors',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'PATCH') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }
  let responseJson = {};
  // if (firstFetch) {
  //   await fetch(url, { ...newOptions, ...{ method: 'OPTIONS' } }).then(() => { });
  //   firstFetch = false;
  // }
  await fetch(`${config.url}${url}`, newOptions)
  // .then(checkStatus)
    .then(response => response.json()).then((res) => {
      responseJson = res;
    });
  return responseJson;
}
