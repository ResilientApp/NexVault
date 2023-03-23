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


export const ellipsizeAddress = (address: string, startLen=4, endLen = 4) => {
  return address.substring(0, startLen) + "..."+address.substring(address.length - endLen);
};

export const isNumber = (num: string): boolean =>  {
  try {
    if(isNaN(parseFloat(num))) {
      return false;
    }
  } catch(e) {
    return false;
  }
  return true;
}
