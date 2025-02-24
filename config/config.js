module.exports = {
  name: 'AlienVault OTX - PassiveDNS',
  acronym: 'ADNS',
  description: 'Search passive DNS information from AlienVault OTX',
  defaultColor: 'light-gray',
  entityTypes: ['domain', 'IPv4'],
  styles: ['./styles/styles.less'],
  onDemandOnly: true,
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
  options: []
};
