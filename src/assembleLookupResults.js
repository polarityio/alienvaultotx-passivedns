const { map, get, minBy } = require('lodash/fp');
const {
  logging: { getLogger }
} = require('polarity-integration-utils');
const assembleLookupResults = (passiveDNS, options) =>
  map(({ entity, result }) => {
    // Remove extra results if maxResults is set
    const Logger = getLogger();
    const maxResults = get('maxResults', options);

    if (result.count === 0) {
      return {
        entity,
        data: null
      };
    }

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
  const tags = [];

  const numberOfResults = count ? `Total Results: ${count}` : [];
  tags.push(numberOfResults);

  const firstKnownRecord = minBy('first', passive_dns);
  if (firstKnownRecord.first) {
    const firstKnownDate = `First Known Record: ${firstKnownRecord.first.split('T')[0]}`;
    tags.push(firstKnownDate);
  }

  return tags;
};

module.exports = assembleLookupResults;
