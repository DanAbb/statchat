// Accepts a query string and parses it into a object
export default queryString => {
  const obj = {};
  const queries = queryString.substring(1).split('&');

  for (const query of queries) {
    const [key, value] = query.split('=');
    obj[key] = value;
  }

  return obj;
};
