const { get } = require('lodash/fp');
const { ALIENTVAULT_OTX_BASE_URL } = require('../constants');

const authenticateRequest = async (requestOptions) => ({
  ...requestOptions,
  //url: ALIENTVAULT_OTX_BASE_URL + requestOptions.entity.value,
  headers: {
    ...get('headers', requestOptions),
    Authorization: `${requestOptions.options.apiKey}`
  }
  // body: {
  //   ...requestOptions.body
  // },
});

module.exports = authenticateRequest;
