'use strict';
const {
  logging: { setLogger, getLogger },
  errors: { parseErrorToReadableJson }
} = require('polarity-integration-utils');

const getPassiveDNS = require('./src/queries/getPassiveDNS');
const assembleLookupResults = require('./src/assembleLookupResults');

const doLookup = async (entities, options, cb) => {
  const Logger = getLogger();
  try {
    Logger.debug({ entities }, 'Entities');

    const passiveDNS = await getPassiveDNS(entities, options);

    Logger.trace({ passiveDNS }, 'Search Results');

    const lookupResults = assembleLookupResults(passiveDNS, options);

    Logger.trace({ lookupResults }, 'Lookup Results');
    cb(null, lookupResults);
  } catch (error) {
    const err = parseErrorToReadableJson(error);

    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');
    cb({ detail: error.message || 'Lookup Failed', err });
  }
};

function validateOptions(userOptions, cb) {
  let errors = [];
  if (
      typeof userOptions.apiKey.value !== 'string' ||
      (typeof userOptions.apiKey.value === 'string' && userOptions.apiKey.value.length === 0)
  ) {
    errors.push({
      key: 'apiKey',
      message: 'You must provide an AlienVault OTX API key'
    });
  }

  cb(null, errors);
}

module.exports = {
  startup: setLogger,
  validateOptions,
  doLookup
};
