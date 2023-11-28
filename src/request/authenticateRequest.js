const { get } = require('lodash/fp');

const authenticateRequest = async (requestOptions) => ({
  ...requestOptions,
  headers: {
    ...get('headers', requestOptions),
    Authorization: `${requestOptions.options.apiKey}`
  }
});

module.exports = authenticateRequest;
