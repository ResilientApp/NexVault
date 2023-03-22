import Port = chrome.runtime.Port;
import { ChromeExtMessage } from "../../pojo/ChromeExtMessage";

class BackgroundComm {
  private port?: Port;
  private isConnected = false;
  private notifyMap: { [key: string]: (value: unknown) => void } = {};
  private intervalID?: NodeJS.Timer;
  private connectionAwaiters: ((value: void) => void)[] = [];

  constructor() {
    this.tryComm();
    this._setHeartBeat();
  }

  tryComm() {
    if (this.intervalID) return; // Interval already running.
    this.intervalID = setInterval(() => {
      try {
        this.port = chrome.runtime.connect({
          name: "extension",
        });
        if (this.intervalID) {
          clearInterval(this.intervalID);
          this.intervalID = undefined;
        }
        this._setConnected(true);
        this.port.onDisconnect.addListener(() => {
          this._setConnected(false);
          this.port = undefined;
        });
      } catch (_e) {
        // Intentionally empty
      }
    }, 1000);
  }

  _setHeartBeat() {
    setInterval(async () => {
      if (!this.isConnected) {
        return;
      }
      await this._keepAlive();
    }, 4000);
  }

  _setConnected(val: boolean) {
    if (!val) {
      this.isConnected = false;
      this.tryComm();
      return;
    }
    this.isConnected = true;
    if (!this.port) throw "Assertion 'port exists' failed";
    this.port.onMessage.addListener((msg: ChromeExtMessage) => {
      if (this.notifyMap[msg.id]) {
        this.notifyMap[msg.id](msg.data);
        delete this.notifyMap[msg.id];
      }
    });

    // Notify whoever is waiting.
    for (const awaiter of this.connectionAwaiters) {
      awaiter();
    }
    this.connectionAwaiters = [];
  }

  async waitToConnect(): Promise<void> {
    if (this.isConnected) return;
    return new Promise((resolve) => {
      this.connectionAwaiters.push(resolve);
    });
  }

  sendMessage(msg: ChromeExtMessage) {
    if (!this.port) throw "Assertion 'port exists' failed";
    this.port.postMessage(msg);
  }

  async sendMessageForResponse(msg: ChromeExtMessage) {
    if (!this.port) throw "Assertion 'port exists' failed";
    this.port.postMessage(msg);
    return await this._setNotifier(msg.id);
  }

  async _setNotifier(msgId: string): Promise<unknown> {
    return new Promise((resolve) => {
      this.notifyMap[msgId] = resolve;
    });
  }

  _keepAlive() {
    this.sendMessage({
      id: "keep_alive",
      type: "keep_alive",
      data: undefined,
    });
  }

  async storePassword(password: string): Promise<void> {
    await this.sendMessageForResponse({
      id: "store_password",
      type: "store_password",
      data: password,
    });
  }

  /**
   * Retrieves public key from LegitDoc Sign.
   **/
  async getPassword(): Promise<string> {
    return (await this.sendMessageForResponse({
      id: "get_password",
      type: "get_password",
      data: undefined,
    })) as string;
  }
}

const bgComm = new BackgroundComm();
export default bgComm;
