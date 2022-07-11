import { ChromeExtMessage } from "../pojo/ChromeExtMessage";

let vaultPass: string | undefined;

chrome.runtime.onMessage.addListener(async function (msg: ChromeExtMessage) {
  if (msg.type == "keep_alive") {
    // do nothing
    return;
  }
  if (msg.type == "store_password") {
    vaultPass = msg.data as string;
  }
});

export {};
