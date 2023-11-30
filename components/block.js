polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  entity: Ember.computed.alias('block.entity'),
  defaultToShow: 5,
  numEntriesToShow: 5,
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  actions: {
    showAll() {
      this.set('numEntriesToShow', this.get('details.passive_dns.length'));
    },
    showLess() {
      this.set('numEntriesToShow', this.defaultToShow);
    }
  }
});
