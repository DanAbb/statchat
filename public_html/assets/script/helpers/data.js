import fetch from './fetch';

class DataWidget {
  getUrl() {
    return '';
  }

  getMethod() {
    return 'get';
  }

  getHeaders() {
    return new Headers();
  }

  getBody() {
    return null;
  }
  /**
   * Fetch the data from the api url
   */
  fetch(url, options = {}) {
    return fetch(url || this.getUrl(), Object.assign({
      method: this.getMethod(),
      headers: this.getHeaders(),
      body: this.getBody()
    }, options));
  }
}

export default DataWidget;
