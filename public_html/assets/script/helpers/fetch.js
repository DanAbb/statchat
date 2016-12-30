const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

/**
* Parse response to json (returns promise)
* if parser fails return original response (prevents error when no response body)
*/
const parseJSON = response => response.json().catch(() => response);

export default (url, options = {}) => {
  // options.headers = options.headers || new Headers();
  // console.log(options.headers);

  // set method to uppercase
  options.method = (options.method) ? options.method.toUpperCase() : 'GET';

  return fetch(url, options)
    .then(res => checkStatus(res))
    .then(res => parseJSON(res));
};
