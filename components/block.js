polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  entity: Ember.computed.alias('block.entity'),
  defaultToShow: 5,
  numEntriesToShow: 5,
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  init() {
    let array = new Uint32Array(5);
    this.set('uniqueIdPrefix', window.crypto.getRandomValues(array).join(''));

    this._super(...arguments);
  },
  actions: {
    copyDomains: function () {
      const domains = this.get('details.passive_dns')
        .map((entry) => {
          return entry.hostname;
        })
        .join('\n');

      navigator.clipboard.writeText(domains).then(
        () => {
          this.set('showCopyDomainsMessage', true);

          setTimeout(() => {
            if (!this.isDestroyed) {
              this.set('showCopyDomainsMessage', false);
            }
          }, 2000);
        },
        function (err) {
          console.error('Async: Could not copy domains (alienvaultotx-passivedns: ', err);
        }
      );
    },
    copyData: function () {
      const savedSettings = {
        numEntriesToShow: this.get('numEntriesToShow')
      };

      this.set('numEntriesToShow', this.get('details.passive_dns.length'));

      Ember.run.scheduleOnce(
        'afterRender',
        this,
        this.copyElementToClipboard,
        `alienvault-lookup-container-${this.get('uniqueIdPrefix')}`
      );

      Ember.run.scheduleOnce('destroy', this, this.restoreCopyState, savedSettings);
    },
    showAll() {
      this.set('numEntriesToShow', this.get('details.passive_dns.length'));
    },
    showLess() {
      this.set('numEntriesToShow', this.defaultToShow);
    }
  },
  copyElementToClipboard(element) {
    window.getSelection().removeAllRanges();
    let range = document.createRange();

    range.selectNode(
      typeof element === 'string' ? document.getElementById(element) : element
    );
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  },
  restoreCopyState(savedSettings) {
    this.set('showCopyMessage', true);

    this.set('numEntriesToShow', savedSettings.numEntriesToShow);

    setTimeout(() => {
      if (!this.isDestroyed) {
        this.set('showCopyMessage', false);
      }
    }, 2000);
  }
});
