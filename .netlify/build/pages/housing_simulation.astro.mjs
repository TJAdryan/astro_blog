/* empty css                                 */
import { c as createComponent, a as createAstro, d as addAttribute, e as renderHead, r as renderComponent, f as renderSlot, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { $ as $$PostHogLayout } from "../chunks/PostHogLayout_C_-ndRg9.mjs";
import { $ as $$Header, a as $$Footer } from "../chunks/Header_zAAgypot.mjs";
import { S as SITE_DESCRIPTION, a as SITE_TITLE } from "../chunks/consts_DLzDSCUC.mjs";
/* empty css                                 */
/* empty css                                   */
/* empty css                                              */
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro();
const $$FullWidthLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FullWidthLayout;
  const { title = SITE_TITLE, description = SITE_DESCRIPTION } = Astro2.props;
  return renderTemplate`<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="/fonts/atkinson-bold.woff" as="font" type="font/woff" crossorigin><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body class="min-h-screen bg-slate-50"> ${renderComponent($$result, "Header", $$Header, { "title": SITE_TITLE })} <main class="w-full max-w-none p-0 m-0"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/layouts/FullWidthLayout.astro", void 0);
const $$HousingSimulation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PostHogLayout", $$PostHogLayout, { "data-astro-cid-7w3pr2kh": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "FullWidthLayout", $$FullWidthLayout, { "title": "Housing Simulation", "data-astro-cid-7w3pr2kh": true }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="housing-simulation-page" data-astro-cid-7w3pr2kh> <div class="housing-simulation-container" data-astro-cid-7w3pr2kh> ${renderComponent($$result3, "HousingSimulationComponent", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-7w3pr2kh": true, "client:component-path": "/Users/dominickryan/astro_blog/astro_blog/src/components/HousingSim/HousingSimulation.jsx", "client:component-export": "default" })} </div> </div> ` })} ` })} `;
}, "/Users/dominickryan/astro_blog/astro_blog/src/pages/housing_simulation.astro", void 0);
const $$file = "/Users/dominickryan/astro_blog/astro_blog/src/pages/housing_simulation.astro";
const $$url = "/housing_simulation";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$HousingSimulation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
