import { ChromeExtMessage } from "../pojo/ChromeExtMessage";

let vaultPass: string | undefined;

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (msg: ChromeExtMessage) {
    if (msg.type == "keep_alive") {
      // do nothing
      port.postMessage({ id: msg.id });
      return true;
    }
    if (msg.type == "store_password") {
      vaultPass = msg.data as string;
      port.postMessage({ id: msg.id });
      return true;
    }
    if (msg.type == "get_password") {
      port.postMessage({ id: msg.id, data: vaultPass });
      return true;
    }
  });
});

export {};
