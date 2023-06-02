import { Network } from "../state";

export enum ChainType {
  EVM = "EVM",
  RESILIENT = "RESILIENT",
}

const eth_mainnet: Network = {
  name: "Ethereum Mainnet",
  endpoint: "https://mainnet.infura.io/v3/",
  chainId: "1",
  currency: "ETH",
  active: true,
  accounts: {},
  chaintype: ChainType.EVM,
};
const sepolia_testnet: Network = {
  name: "Sepolia Testnet",
  endpoint: "https://sepolia.infura.io/v3/",
  chainId: "11155111",
  currency: "SepoliaETH",
  accounts: {},
  chaintype: ChainType.EVM,
};
const goerli_testnet: Network = {
  name: "Goerli Testnet",
  endpoint: "https://goerli.infura.io/v3/",
  chainId: "5",
  currency: "GoerliETH",
  accounts: {},
  chaintype: ChainType.EVM,
};

export {
    sepolia_testnet,
    goerli_testnet,
    eth_mainnet
}