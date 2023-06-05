import { BlockChainType, TokenWallet, WalletInformation } from "./TokenWallet";
import { ethers } from "ethers";

export class RokWallet extends TokenWallet {
  blockChain: string = BlockChainType.ROK;
  constructor(rpcUrl: string, mnemonic?: string) {
    super(rpcUrl, mnemonic);
  }
  public generatePublicPrivateKeys(): WalletInformation {
    if (this.getWallet()) throw Error("Wallet Already Created");
    const { address, publicKey, privateKey } = ethers.Wallet.fromPhrase(
      this.getMnemonic()
    );
    return { address, publicKey, privateKey };
  }
  public async signTransaction(txObject: any) {
    const provider: any = new ethers.JsonRpcProvider(this.getRpcUrl());
    const signer = new ethers.Wallet(this.getPrivateKey(), provider);
    const tx = await signer.sendTransaction({ ...txObject });
    const receipt = await tx.wait();
    console.log(receipt);
    // SEND A TRANSACTION EVENT TO GET THE RECEIPT AND TX DATA FOR THE TRANSACTION SECTION
  }
  public async getWalletBalance() {
    const provider: any = new ethers.JsonRpcProvider(this.getRpcUrl());
    const balance = await provider.getBalance(this.getAddress());
    console.log(ethers.formatEther(balance));
    return balance;
  }
  public async transferOwnership() {
    return "hello";
  }
  public addWalletTransactions(receipt: any) {
    console.log("hello");
  }
  public recoverAccountWithPrivateKey(privateKey: string) {
      console.log("ADD")
  }
}