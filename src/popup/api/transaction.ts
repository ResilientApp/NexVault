import { delay } from "../../utils/utils";

export interface Transaction {
  type: string;
  data: any;
  destination: string;
  signature?: string;
  pubKey: string;
}


export interface SubmitTxResponse {
  error: boolean;
  message?: string;
}
export const submitTransaction = async (endpoint: string, tx: Transaction): Promise<SubmitTxResponse> => {
  await delay(3000);
  return {
    error: false
  }
}

export interface TxStatusResponse {
  error: boolean;
  message?: string;
  txError?: boolean;
  txInfo?: any;
}

export const getTxStatus = async (endpoint: string, txHash: string): Promise<TxStatusResponse> => {
  await delay(2000);
  return {
    error: false,
    txError: false,
    txInfo: {
      block: 2
    }
  }
}
