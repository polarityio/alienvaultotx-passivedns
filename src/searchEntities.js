const { getPassiveDNS } = require('./queries');

const searchEntities = async (entities, options) => {
  const results = await getPassiveDNS(entities, options);

  return results;
};

module.exports = searchEntities;
