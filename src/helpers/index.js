const { pipe, partial } = require('lodash/fp');

const convertStrToObject = pipe(partial(JSON.parse));

module.exports = { convertStrToObject };
