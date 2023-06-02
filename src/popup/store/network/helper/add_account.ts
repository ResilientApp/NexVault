import { ChainType } from "./supported_chains";
import { EthereumWallet } from "../../../../classes/EthereumWallet";
import { TokenWallet } from "../../../../classes/TokenWallet";

const add_account = (chain_type: ChainType, rpcUrl: string, mnemnoic?: string, privateKey?: string) : TokenWallet => {
    if (chain_type === ChainType.EVM) {
        return new EthereumWallet(rpcUrl, mnemnoic, privateKey)
    }
    throw new Error("Unsupported Chain Type");
}

export {
    add_account
}
