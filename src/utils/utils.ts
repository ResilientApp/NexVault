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
