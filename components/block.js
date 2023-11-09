polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return time;
  }),
  passiveDNS: Ember.computed.alias('details.passiveDNS')
});
// Compare this snippet from src/assembleLookupResults.js:
