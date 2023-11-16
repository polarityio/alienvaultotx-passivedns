const { map, get, minBy } = require("lodash/fp");
const { DateTime } = require("luxon");

const assembleLookupResults = (passiveDNS, options) =>
  map(({ entity, result }) => {
    // Remove extra results if maxResults is set
    const maxResults = get("maxResults", options);

    const trimmedResults =
      result.count > maxResults
        ? result.passive_dns.slice(0, maxResults)
        : result.passive_dns;

    result.passive_dns = trimmedResults;

    // Convert timestamps to options.dataFormat
    result.passive_dns = map((record) => ({
      ...record,
      first: timeToOptionsFormat(record.first, options),
      last: timeToOptionsFormat(record.last, options),
    }))(result.passive_dns);

    const lookupResult = {
      entity,
      data: result
        ? {
            summary: createSummaryTags(result, options),
            details: result,
          }
        : null,
    };

    return lookupResult;
  })(passiveDNS);

const timeToOptionsFormat = (time, options) => {
  const dataFormat = get("dataFormat", options);

  return DateTime.fromISO(time).toFormat(dataFormat);
};

const createSummaryTags = ({ count, passive_dns }, options) => {
  const numberOfResults = count ? `Total Results: ${count}` : [];

  const firstKnownRecord = minBy("first", passive_dns);
  const firstKnownDate = `First Known Record: ${firstKnownRecord.first}`;

  return []
    .concat("AlienvaultOTX - PassiveDNS")
    .concat(numberOfResults)
    .concat(firstKnownDate);
};

module.exports = assembleLookupResults;
