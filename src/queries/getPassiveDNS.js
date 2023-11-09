const { requestWithDefaults, requestsInParallel } = require('../request');
const { map } = require('lodash/fp');
const { ALIENTVAULT_OTX_BASE_URL } = require('../constants');

const { convertStrToObject } = require('../helpers');

const getPassiveDNS = async (entities, options) => {
  const dnsRequests = map(
    (entity) => ({
      entity,
      url: ALIENTVAULT_OTX_BASE_URL + entity.value,
      method: 'GET',
      options
    }),
    entities
  );

  const dnsResponses = await requestsInParallel(dnsRequests, 'body');

  const dnsResponsesWithResultsObject = map((response) => ({
    ...response,
    result: JSON.parse(response.result)
  }))(dnsResponses);

  return dnsResponsesWithResultsObject;
};

module.exports = getPassiveDNS;
