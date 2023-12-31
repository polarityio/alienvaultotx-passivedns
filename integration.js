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

    entities = entities.filter(isValidEntity);
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

const isLoopBackIp = (entity) => {
  return entity.startsWith('127');
};

const isLinkLocalAddress = (entity) => {
  return entity.startsWith('169');
};

const isPrivateIP = (entity) => {
  return entity.isPrivateIP === true;
};

/**
 * Filter out private IPs
 * @param entity
 * @returns {boolean} true if the entity is valid (domain or public IP), false otherwise
 */
const isValidEntity = (entity) => {
  if (entity.isIP) {
    return !(
      isLoopBackIp(entity.value) ||
      isLinkLocalAddress(entity.value) ||
      isPrivateIP(entity)
    );
  }
  return true;
};

function validateOptions(userOptions, cb) {
  let errors = [];
  if (
    typeof userOptions.apiKey.value !== 'string' ||
    (typeof userOptions.apiKey.value === 'string' &&
      userOptions.apiKey.value.length === 0)
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
