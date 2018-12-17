var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "ahead public rate certain seat today until health spread off punch trophy";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/4684e800247c4a16a0161cbeb40bfba9")
      },
      network_id: 3
    }
  },
  rpc: {
    host: '127.0.0.1',
    post: 8080
  }
};
