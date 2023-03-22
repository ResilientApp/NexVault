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
