const { requestsInParallel } = require('../request');
const { map } = require('lodash/fp');

const ALIENVAULT_OTX_BASE_URL =
  'https://otx.alienvault.com/otxapi/indicators/domain/passive_dns/';

const getPassiveDNS = async (entities, options) => {
  const dnsRequests = map(
    (entity) => ({
      entity,
      url: ALIENVAULT_OTX_BASE_URL + entity.value,
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
