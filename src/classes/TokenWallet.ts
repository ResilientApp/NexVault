import * as bip39 from 'bip39';

export type WalletInformation = {
    publicKey: string | null;
    privateKey: string;
    address: string;
}

export abstract class TokenWallet {
    private readonly wallet: WalletInformation;
    private readonly mnemonic: string;
    private readonly rpcUrl: string;
    protected walletTransactions: any[];

    constructor(rpcUrl: string, mnemonic?: string, privateKey?: string) {
        if (!privateKey) {
            if (!mnemonic) {
                this.mnemonic = this.createNewMnemonic();
            } else {
                this.mnemonic = mnemonic;
            }
            if (!this.isValidMnemonic()) throw Error("Invalid Mnemonic");
            this.wallet = this.generatePublicPrivateKeys();
        } else {
            this.wallet = this.recoverAccountWithPrivateKey(privateKey)
            this.mnemonic = ""
        }
        this.rpcUrl = rpcUrl;
        this.walletTransactions = []
    }

    public createNewMnemonic() : string {
        const mnemonic = bip39.generateMnemonic();
        return mnemonic;
    }
    abstract generatePublicPrivateKeys() : WalletInformation;
    abstract recoverAccountWithPrivateKey(privateKey: string) : any;
    abstract signTransaction(txObject: any) : any;
    abstract transferOwnership?() : any;
    abstract getWalletBalance(): any;
    abstract addWalletTransactions(receipt: any): any;

    public getAddress() {
        return this.wallet.address;
    }
    public getPrivateKey() {
        return this.wallet.privateKey;
    }
    public getPublicKey() {
        return this.wallet.publicKey;
    }
    public getWallet() {
        return this.wallet;
    }
    public getMnemonic() {
        return this.mnemonic;
    }
    public getRpcUrl() {
        return this.rpcUrl
    }
    public isValidMnemonic() {
        const words = this.getMnemonic().split(" ");
        return words.length == 12;
    }
}