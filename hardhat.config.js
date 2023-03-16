require("@nomicfoundation/hardhat-toolbox");
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17"
  // ,
  // networks: {
  //   goerli: {
  //     url: process.env.NETWORK_URL,
  //     accounts: [process.env.PRIVATE_KEY]
  //   }
  // }
};
