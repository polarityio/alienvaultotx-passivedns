module.exports = {
  name: "AlienvaultOTX - PassiveDNS",
  acronym: "ADNS",
  description: "Converts timestamps into any Time Zone",
  defaultColor: "light-gray",
  entityTypes: ["IPv4", "IPv6", "domain"],
  styles: ["./styles/styles.less"],
  block: {
    component: {
      file: "./components/block.js",
    },
    template: {
      file: "./templates/block.hbs",
    },
  },
  request: {
    cert: "",
    key: "",
    passphrase: "",
    ca: "",
    proxy: "",
  },
  logging: {
    level: "info", //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: "apiKey",
      name: "Alienvault OTX API Key",
      description: "Alienvault OTX",
      default: "",
      type: "password",
      userCanEdit: true,
      adminOnly: false,
    },
    {
      key: "dataFormat",
      name: "Data Format",
      description: "Data Format to return",
      default: "y-LL-dd TT",
      type: "text",
      userCanEdit: true,
      adminOnly: false,
    },
    {
      key: "maxResults",
      name: "Max Results",
      description: "Max number of results to return",
      default: 25,
      type: "number",
      userCanEdit: true,
      adminOnly: false,
    },
  ],
};
