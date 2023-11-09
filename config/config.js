module.exports = {
  name: 'AlienvaultOTX - PassiveDNS',
  acronym: 'ADNS',
  description: 'Converts timestamps into any Time Zone',
  defaultColor: 'light-gray',
  entityTypes: [],
  styles: ['./styles/styles.less'],
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ''
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'apiKey',
      name: 'Alienvault OTX API Key',
      description: 'Alienvault OTX',
      default: '',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    }
  ]
};
