const authenticateRequest = require('./authenticateRequest');
const config = require('../../config/config');
const {
  requests: { createRequestWithDefaults }
} = require('polarity-integration-utils');

const { parallelLimit } = require('async');
const { map, get, getOr, filter, flow, negate, isEmpty } = require('lodash/fp');

const requestWithDefaults = createRequestWithDefaults({
  config,
  preprocessRequestOptions: authenticateRequest,
  postprocessRequestFailure: async (error, requestOptions) => {
    // Ignore invalid domain errors which can occur via Web Search due to the parser
    // allowing through invalid TLDs.
    if (error.status === 400 && error.description.includes('Invalid domain')) {
      return;
    }
    throw Error;
  }
});

const createRequestsInParallel =
  (requestWithDefaults) =>
  async (
    requestsOptions,
    responseGetPath,
    limit = 10,
    onlyReturnPopulatedResults = true
  ) => {
    const unexecutedRequestFunctions = map(
      ({ entity, ...requestOptions }) =>
        async () => {
          const response = await requestWithDefaults(requestOptions);
          const result = responseGetPath ? get(responseGetPath, response) : response;
          return entity ? { entity, result } : result;
        },
      requestsOptions
    );

    const results = await parallelLimit(unexecutedRequestFunctions, limit);

    return onlyReturnPopulatedResults
      ? filter(
          flow((result) => getOr(result, 'result', result), negate(isEmpty)),
          results
        )
      : results;
  };

const requestsInParallel = createRequestsInParallel(requestWithDefaults);

module.exports = {
  requestWithDefaults,
  requestsInParallel
};
