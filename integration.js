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

    const lookupResults = assembleLookupResults(passiveDNS);

    Logger.trace({ lookupResults }, 'Lookup Results');
    cb(null, lookupResults);
  } catch (error) {
    const err = parseErrorToReadableJson(error);

    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');
    cb({ detail: error.message || 'Lookup Failed', err });
  }
};

const isLoopBackIp = (entity) => {
  return entity.value.startsWith('127');
};

const isSourceAddressOnly = (entity) => {
  return entity.value.startsWith('0.');
};

const isLinkLocalAddress = (entity) => {
  return entity.value.startsWith('169');
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
      isLoopBackIp(entity) ||
      isLinkLocalAddress(entity) ||
      isPrivateIP(entity) ||
      isSourceAddressOnly(entity)
    );
  }
  return true;
};

module.exports = {
  startup: setLogger,
  doLookup
};
