let showDialogRef = null;
let readyPromiseResolve;
const readyPromise = new Promise((resolve) => {
  readyPromiseResolve = resolve;
});

/**
 * Sets the global dialog function.
 * Call this from your DialogProvider once it has created showDialog.
 */
export const setGlobalDialog = (fn) => {
  showDialogRef = fn;
  readyPromiseResolve(fn);
};

/**
 * Returns a promise that resolves to the global showDialog function.
 * You can await this to ensure that showDialog is ready.
 */
export const getGlobalDialog = async () => {
  if (showDialogRef) {
    return showDialogRef;
  }
  return await readyPromise;
};