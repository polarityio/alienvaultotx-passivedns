'use strict';
const { setLogger, getLogger } = require('./src/logging');

const {
  errors: { parseErrorToReadableJson }
} = require('polarity-integration-utils');
const {
  userOptions: { validateOptions }
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

const onMessage = ({ action, data: actionParams }, options, callback) =>
  onMessageFunctions[action](actionParams, options, callback);

module.exports = {
  startup: setLogger,
  validateOptions,
  doLookup,
  onMessage
};
