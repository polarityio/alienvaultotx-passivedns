const { map, get, minBy } = require('lodash/fp');

const assembleLookupResults = (passiveDNS, options) =>
  map(({ entity, result }) => {
    if (!result || result.count === 0) {
      return {
        entity,
        data: null
      };
    }

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
