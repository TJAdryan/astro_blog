/* empty css                                 */
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { $ as $$PostHogLayout } from "../chunks/PostHogLayout_C_-ndRg9.mjs";
import { H as HousingSimulation } from "../chunks/HousingSimulation_B5Y3F42g.mjs";
import { renderers } from "../renderers.mjs";
const $$DebugHousingSim = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PostHogLayout", $$PostHogLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Debug: Housing Simulation</h1> ${renderComponent($$result2, "HousingSimulation", HousingSimulation, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/dominickryan/astro_blog/astro_blog/src/components/HousingSim/HousingSimulation.jsx", "client:component-export": "default" })} ` })}`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/pages/debug-housing-sim.astro", void 0);
const $$file = "/Users/dominickryan/astro_blog/astro_blog/src/pages/debug-housing-sim.astro";
const $$url = "/debug-housing-sim";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DebugHousingSim,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
