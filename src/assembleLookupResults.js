const { map, get, minBy } = require('lodash/fp');

const assembleLookupResults = (passiveDNS, options) =>
  map(({ entity, result }) => {
    // Remove extra results if maxResults is set
    const maxResults = get('maxResults', options);

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
  const numberOfResults = count ? `Total Results: ${count}` : [];

  const firstKnownRecord = minBy('first', passive_dns);
  const firstKnownDate = `First Known Record: ${firstKnownRecord.first}`;

  return [].concat(numberOfResults).concat(firstKnownDate);
};

module.exports = assembleLookupResults;
