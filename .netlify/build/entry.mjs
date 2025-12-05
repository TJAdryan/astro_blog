import { renderers } from "./renderers.mjs";
import { s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_DYQ_v7bF.mjs";
import { manifest } from "./manifest_QMvuSB6J.mjs";
import { createExports } from "@astrojs/netlify/ssr-function.js";
const serverIslandMap = /* @__PURE__ */ new Map();
;
const _page0 = () => import("./pages/_image.astro.mjs");
const _page1 = () => import("./pages/about.astro.mjs");
const _page2 = () => import("./pages/api/submit-summary.astro.mjs");
const _page3 = () => import("./pages/blog.astro.mjs");
const _page4 = () => import("./pages/blog/_---slug_.astro.mjs");
const _page5 = () => import("./pages/contact.astro.mjs");
const _page6 = () => import("./pages/debug-housing-sim.astro.mjs");
const _page7 = () => import("./pages/housing_simulation.astro.mjs");
const _page8 = () => import("./pages/interesting-articles.astro.mjs");
const _page9 = () => import("./pages/login.astro.mjs");
const _page10 = () => import("./pages/more-about-me.astro.mjs");
const _page11 = () => import("./pages/private.astro.mjs");
const _page12 = () => import("./pages/q-train.astro.mjs");
const _page13 = () => import("./pages/rss.xml.astro.mjs");
const _page14 = () => import("./pages/us-housing-model.astro.mjs");
const _page15 = () => import("./pages/index.astro.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
  ["src/pages/about.astro", _page1],
  ["src/pages/api/submit-summary.js", _page2],
  ["src/pages/blog/index.astro", _page3],
  ["src/pages/blog/[...slug].astro", _page4],
  ["src/pages/contact.astro", _page5],
  ["src/pages/debug-housing-sim.astro", _page6],
  ["src/pages/housing_simulation.astro", _page7],
  ["src/pages/interesting-articles.astro", _page8],
  ["src/pages/login.astro", _page9],
  ["src/pages/more-about-me.astro", _page10],
  ["src/pages/private.astro", _page11],
  ["src/pages/q-train.astro", _page12],
  ["src/pages/rss.xml.js", _page13],
  ["src/pages/us-housing-model.astro", _page14],
  ["src/pages/index.astro", _page15]
]);
const _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: () => import("./noop-entrypoint.mjs"),
  middleware: () => import("./_astro-internal_middleware.mjs")
});
const _args = {
  "middlewareSecret": "007b39c3-1766-4ab2-86f6-3bb5306ce22e"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
