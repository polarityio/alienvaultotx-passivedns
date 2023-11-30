module.exports = {
  name: 'AlienVault OTX - PassiveDNS',
  acronym: 'ADNS',
  description: 'Search passive DNS information from AlienVault OTX',
  defaultColor: 'light-gray',
  entityTypes: ['domain'],
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
    level: 'trace' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'apiKey',
      name: 'AlienVault OTX API Key',
      description: 'A valid AlienVault OTX API key',
      default: '',
      type: 'password',
      userCanEdit: true,
      adminOnly: true
    },
    {
      key: 'maxResults',
      name: 'Max Results',
      description: 'Max number of results to return',
      default: 50,
      type: 'number',
      userCanEdit: true,
      adminOnly: true
    }
  ]
};
