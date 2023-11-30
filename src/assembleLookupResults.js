const { map, get, minBy } = require('lodash/fp');
const { logging: { getLogger } } = require('polarity-integration-utils');
const assembleLookupResults = (passiveDNS, options) =>
  map(({ entity, result }) => {
    // Remove extra results if maxResults is set
      const Logger = getLogger();
    const maxResults = get('maxResults', options);
Logger.info({result, maxResults}, 'Result and Max Results');
    const trimmedResults =
      result.count > maxResults
        ? result.passive_dns.slice(0, maxResults)
        : result.passive_dns;

    result.passive_dns = trimmedResults;

    const lookupResult = {
      entity,
      data: result
        ? {
            summary: createSummaryTags(result, options),
            details: result
          }
        : null
    };

    return lookupResult;
  })(passiveDNS);

const createSummaryTags = ({ count, passive_dns }, options) => {
    const Logger = getLogger();
  const numberOfResults = count ? `Total Results: ${count}` : [];

  const firstKnownRecord = minBy('first', passive_dns);
    Logger.info({firstKnownRecord, numberOfResults}, 'First Known Record');
  const firstKnownDate = `First Known Record: ${firstKnownRecord.first}`;


  return [].concat(numberOfResults).concat(firstKnownDate);
};

module.exports = assembleLookupResults;
