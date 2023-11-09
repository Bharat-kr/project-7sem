require("@nomiclabs/hardhat-waffle");

const endpointUrl =
  "https://eth-sepolia.g.alchemy.com/v2/LrMc5RVmPcXfwJ2WK9mYjkYs9QUdKoDI";
const privateKey =
  "72243dee323acf5d072dfb423ce58266f66e12add974cb586aeef172469ac656";

module.exports = {
  solidity: "0.8.21",
  networks: {
    sepolia: {
      url: endpointUrl,
      accounts: [privateKey],
    },
  },
};
