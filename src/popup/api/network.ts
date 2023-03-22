import { delay } from "../../utils/utils";
import { Activity } from "../store/account";

interface NetworkStatusResponse {
  error: boolean;
  message?: string;
  network?: {
    currency: string;
  };
}

export const getNetworkStatus = async (
  endpoint: string
): Promise<NetworkStatusResponse> => {
  await delay(3000);
  return { error: false, network: { currency: "UTXO" } };
};

interface AccountStatusResponse {
  error: boolean;
  message?: string;
  account?: {
    balance: number;
    activity: Activity[];
  };
}

export const getAccountStatus = async (
  endpoint: string,
  address: string
): Promise<AccountStatusResponse> => {
  await delay(3000);
  // Mock response
  return {
    error: false,
    account: {
      balance: 15.26,
      activity: [
        {
          type: "send",
          amount: 1.2307,
          address: "daad818CA8B9251b393131C08a736A67ccB19297",
          id: 1,
          timestamp: new Date("12 Mar 2023").getTime(),
        },
        {
          type: "receive",
          amount: 6.512,
          address: "deaf702A9b26f8a643a31a4c84b9392589e03D7c",
          id: 2,
          timestamp: new Date("13 Mar 2023").getTime(),
        },
        {
          type: "send",
          amount: 1.112,
          address: "deed702A9b26f8a643a31a4c84b9392589e0aacd",
          id: 3,
          timestamp: new Date("14 Mar 2023").getTime(),
        },
      ],
    },
  };
};
