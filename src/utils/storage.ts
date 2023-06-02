export const set = async (key: string, val: unknown) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: val }, () => {
      resolve(undefined);
    });
  });
};

export const get = async (key: string) => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result && result[key]);
    });
  });
};

export const remove = async (key: string) => {
  return chrome.storage.local.remove(key);
};