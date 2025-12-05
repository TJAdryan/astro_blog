import { c as createComponent, a as createAstro, b as renderTemplate, r as renderComponent, f as renderSlot, e as renderHead, d as addAttribute } from "./astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { a as $$Footer, $ as $$Header } from "./Header_zAAgypot.mjs";
import { S as SITE_DESCRIPTION, a as SITE_TITLE } from "./consts_DLzDSCUC.mjs";
/* empty css                         */
/* empty css                           */
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = SITE_TITLE, description = SITE_DESCRIPTION } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="description"', '><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Preload critical fonts for better performance --><link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="/fonts/atkinson-bold.woff" as="font" type="font/woff" crossorigin><meta name="generator"', "><title>", "</title>", '</head> <body class="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50"> ', ' <main class="max-w-3xl mx-auto px-4 py-8"> ', " <!-- Your page content will go here --> </main> ", ' <!-- Defer non-critical JavaScript for better performance --> <script src="/js/dailyWidget.js" defer><\/script> </body> </html>'])), addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), title, renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/dominickryan/astro_blog/astro_blog/src/layouts/BaseLayout.astro", void 0);
export {
  $$BaseLayout as $
};
