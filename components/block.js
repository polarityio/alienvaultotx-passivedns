polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  entity: Ember.computed.alias('block.entity'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  // Session Paging Variables
  filterValue: '',
  currentPage: 1,
  pageSize: 5,
  pagingData: Ember.computed.alias('details.passive_dns'),
  filteredPagingData: Ember.computed('pagingData.length', 'filterValue', function () {
    // reset to page 1 when filter changes
    this.set('currentPage', 1);

    let filterValue = this.get('filterValue');

    if (filterValue) {
      filterValue = filterValue.toLowerCase().trim();
      if (filterValue.length > 0) {
        return this.get('pagingData').filter((entry) => {
          return (
            entry.hostname.toLowerCase().includes(filterValue) ||
            entry.address.toLowerCase().includes(filterValue)
          );
        });
      }
    }

    return this.get('pagingData');
  }),
  isPrevButtonsDisabled: Ember.computed('currentPage', function () {
    return this.get('currentPage') === 1;
  }),
  isNextButtonDisabled: Ember.computed(
    'filteredPagingData.length',
    'pageSize',
    'currentPage',
    function () {
      const totalResults = this.get('filteredPagingData.length');
      const totalPages = Math.ceil(totalResults / this.get('pageSize'));
      return this.get('currentPage') === totalPages;
    }
  ),
  pagingStartItem: Ember.computed('currentPage', 'pageSize', function () {
    return (this.get('currentPage') - 1) * this.get('pageSize') + 1;
  }),
  pagingEndItem: Ember.computed('pagingStartItem', function () {
    return this.get('pagingStartItem') - 1 + this.get('pageSize');
  }),
  pagedPagingData: Ember.computed(
    'filteredPagingData.length',
    'pageSize',
    'currentPage',
    function () {
      if (!this.get('filteredPagingData')) {
        return [];
      }
      const startIndex = (this.get('currentPage') - 1) * this.get('pageSize');
      const endIndex = startIndex + this.get('pageSize');

      return this.get('filteredPagingData').slice(startIndex, endIndex);
    }
  ),
  // End of Paging Variables
  init() {
    let array = new Uint32Array(5);
    this.set('uniqueIdPrefix', window.crypto.getRandomValues(array).join(''));

    this._super(...arguments);
  },
  actions: {
    // Start Paging Actions
    prevPage() {
      let currentPage = this.get('currentPage');

      if (currentPage > 1) {
        this.set('currentPage', currentPage - 1);
      }
    },
    nextPage() {
      const totalResults = this.get('filteredPagingData.length');
      const totalPages = Math.ceil(totalResults / this.get('pageSize'));
      let currentPage = this.get('currentPage');
      if (currentPage < totalPages) {
        this.set('currentPage', currentPage + 1);
      }
    },
    firstPage() {
      this.set('currentPage', 1);
    },
    lastPage() {
      const totalResults = this.get('filteredPagingData.length');
      const totalPages = Math.ceil(totalResults / this.get('pageSize'));
      this.set('currentPage', totalPages);
    },
    // End Paging Actions
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
