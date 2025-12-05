async function createAsyncLocalStorage() {
  const { AsyncLocalStorage } = await import("async_hooks");
  return new AsyncLocalStorage();
}
var authAsyncStorage = await createAsyncLocalStorage();
export {
  authAsyncStorage as a
};
