import { TokenWallet, WalletInformation, BlockChainType } from "./TokenWallet";
import { BigNumberish, Wallet, ethers } from "ethers";

type EthereumTxObject = {
  to: string;
  gasLimit: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  nonce: number;
  value: BigNumberish;
};

export class EthereumWallet extends TokenWallet {
  blockChain: string = BlockChainType.ETHEREUM
  constructor(rpcUrl: string, mnemonic?: string, privateKey?: string) {
    super(rpcUrl, mnemonic, privateKey);
  }
  public generatePublicPrivateKeys(): WalletInformation {
    if (this.getWallet()) throw Error("Wallet Already Created");
    const { address, publicKey, privateKey } = ethers.Wallet.fromPhrase(
      this.getMnemonic()
    );
    return { address, publicKey, privateKey };
  }
  public recoverAccountWithPrivateKey(userPrivateKey: string) {
    if (this.getWallet()) throw Error("Wallet Already Created");
    const { address, privateKey } = new ethers.Wallet(userPrivateKey)
    return { address, publicKey: null, privateKey };
  }
  public async signTransaction(txObject: EthereumTxObject) {
    const provider: any = new ethers.JsonRpcProvider(this.getRpcUrl());
    const signer = new ethers.Wallet(this.getPrivateKey(), provider);
    const tx = await signer.sendTransaction({...txObject});
    const receipt = await tx.wait();
    console.log(receipt)
    // SEND A TRANSACTION EVENT TO GET THE RECEIPT AND TX DATA FOR THE TRANSACTION SECTION
  }
  public async getWalletBalance() {
    const provider: any = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/8dbc23a269684acd88e118d93a47427c");
    const balance = await provider.getBalance(this.getAddress())
    return balance
  }
  public addWalletTransactions(receipt: any) {
    this.walletTransactions.push(receipt);
  }
  public async transferOwnership() {
      return "hello";
  }
}