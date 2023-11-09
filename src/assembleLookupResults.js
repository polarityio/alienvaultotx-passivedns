const { map, get, minBy } = require('lodash/fp');
const assembleLookupResults = (passiveDNS, options) =>
  map(({ entity, result }) => {
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
  }, passiveDNS);

const createSummaryTags = ({ count, passive_dns }, options) => {
  const numberOfResults = count ? `Number of Results: ${count}` : [];

  const firstKnownRecord = minBy('first', passive_dns);
  const firstKnownDate = `First Known Record: ${firstKnownRecord.first}`;

  return []
    .concat('AlienvaultOTX - PassiveDNS')
    .concat(numberOfResults)
    .concat(firstKnownDate);
};

module.exports = assembleLookupResults;
