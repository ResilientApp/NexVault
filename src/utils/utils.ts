import { ethers } from "ethers";
import { notification } from "ant-design-vue";
import { VueNode } from "ant-design-vue/lib/_util/type";
import { EthereumWallet } from "../classes/EthereumWallet";
import { RokWallet } from "../classes/RokWallet";
import { BlockChainType } from "../classes/TokenWallet";

export function isDevMode(): boolean {
  return process.env.NODE_ENV === "development";
}

/* Vue fix to await for browser paint */
export async function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function isValidPrivateKey(privateKey: string) : boolean {
  return ensureNo0xInHex(privateKey).length == 64;
}

export const isSendCoinTxInputValid = (
  ethToSend: string,
  accountBalance: number,
  toAddress: string
): boolean => {
  if (!isNumber(ethToSend)) {
    eventErrorPopup("Enter a valid amount");
    return false;
  }
  if (parseFloat(ethToSend) > (parseFloat(ethers.formatEther(accountBalance)) || 0)) {
    eventErrorPopup("Insufficient funds");
    return false;
  }
  if (!ethers.isAddress(toAddress)) {
    eventErrorPopup("Invalid Address");
    return false;
  }
  return true;
};

export function eventSuccessfulPopup(txt: VueNode): void {
  notification.success({ message: txt });
}

export function eventErrorPopup(txt: VueNode): void {
  notification.error({ message: txt });
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export async function setImmediateInterval(
  callback: () => void,
  ms: number
): Promise<ReturnType<typeof setInterval>> {
  await callback();
  return setInterval(callback, ms);
}

export const ensure0xInHex = (hexString: string) => {
  return hexString.startsWith("0x") ? hexString : "0x" + hexString;
};

export const ensureNo0xInHex = (hexString: string) => {
  return hexString.startsWith("0x")
    ? hexString.substr(2, hexString.length)
    : hexString;
};

export const ellipsizeAddress = (address: string, startLen = 4, endLen = 4) => {
  return (
    address.substring(0, startLen) +
    "..." +
    address.substring(address.length - endLen)
  );
};

export const isNumber = (num: string): boolean => {
  try {
    if (isNaN(parseFloat(num))) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
};

export const injectKeyValuePair = (injectKey: string, injectValue: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId: any = tabs[0].id;
    if (tabId) {
      const args: [{ key: string; value: string }] = [
        { key: injectKey, value: injectValue.toString() },
      ];
      chrome.scripting.executeScript({
        target: { tabId },
        args,
        func: (args: { key: string; value: string }) => {
          localStorage.setItem(args.key, args.value);
        },
      });
    } else {
      console.error("Undefined tabid");
    }
  });
};

export const getKeyValueFromSelectedTab = (key: string): any => {
  let value: string | null;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId: any = tabs[0].id;
    if (tabId) {
      const args: [{ key: string }] = [{ key: key }];
      chrome.scripting.executeScript({
        target: { tabId },
        args,
        func: (args: { key: string }) => {
          value = localStorage.getItem(args.key);
        },
      });
    } else {
      console.error("Undefined tabid");
    }
    return value;
  });
};

export function castStrippedObjectToWalletObjectType(proxyWalletObject: any) : EthereumWallet | RokWallet {
  if (proxyWalletObject.blockChain === BlockChainType.ETHEREUM) return Object.assign(EthereumWallet.prototype, proxyWalletObject);
  return Object.assign(RokWallet.prototype, proxyWalletObject);
}