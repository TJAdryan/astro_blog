async function getMod() {
  return import("./2025-09-29-From-Raw-to-Polished_DPK3a_YK.mjs");
}
const collectedLinks = [];
const collectedStyles = [];
const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts: [] };
export {
  defaultMod as default
};
