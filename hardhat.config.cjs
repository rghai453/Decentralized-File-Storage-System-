
require( "@nomicfoundation/hardhat-toolbox");
require( "@nomicfoundation/hardhat-ignition");


const PRIVATE_KEY = "0x8c5aba4b00c0f2d23090b4c65d2b9fa849981148a4aa4db963b3e29ea29b0b4f";
const INFURA_PROJECT_ID="5a6b8e8d23744844aa033cf9aad47ef4"

const networkConfig= {
  hardhat: {},
  sepolia: {
    url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
    accounts: [PRIVATE_KEY],
    chainId: 11155111, 
    gasPrice: 20000000000,
    gas: 6000000
  },
};

module.exports = {
  solidity: "0.8.0",
  networks: networkConfig
};

