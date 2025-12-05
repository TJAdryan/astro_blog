import { c as createComponent, a as createAstro, b as renderTemplate, r as renderComponent, f as renderSlot, e as renderHead } from "./astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { Image as $$Image } from "./_astro_assets_DKE-QtcE.mjs";
import { $ as $$BaseHead } from "./BaseHead_mYQ8vpBh.mjs";
/* empty css                           */
import { a as $$Footer, $ as $$Header } from "./Header_zAAgypot.mjs";
import { $ as $$FormattedDate } from "./FormattedDate_jFLUYorq.mjs";
/* empty css                         */
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$BlogPost = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPost;
  const { title, description, pubDate, updatedDate, heroImage } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-bvzihdzo> <head>', "", "</head> <body data-astro-cid-bvzihdzo> ", ' <main data-astro-cid-bvzihdzo> <article data-astro-cid-bvzihdzo> <div class="hero-image" data-astro-cid-bvzihdzo> ', ' </div> <div class="prose" data-astro-cid-bvzihdzo> <div class="title" data-astro-cid-bvzihdzo> <div class="date" data-astro-cid-bvzihdzo> ', " ", " </div> <h1 data-astro-cid-bvzihdzo>", "</h1> <hr data-astro-cid-bvzihdzo> </div> ", " </div> </article> </main> ", ' <script src="/js/dailyWidget.js"><\/script> </body> </html>'])), renderComponent($$result, "BaseHead", $$BaseHead, { "title": title, "description": description, "data-astro-cid-bvzihdzo": true }), renderHead(), renderComponent($$result, "Header", $$Header, { "data-astro-cid-bvzihdzo": true }), heroImage && renderTemplate`${renderComponent($$result, "Image", $$Image, { "width": 1020, "height": 510, "src": heroImage, "alt": "", "data-astro-cid-bvzihdzo": true })}`, renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": pubDate, "data-astro-cid-bvzihdzo": true }), updatedDate && renderTemplate`<div class="last-updated-on" data-astro-cid-bvzihdzo>
Last updated on ${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": updatedDate, "data-astro-cid-bvzihdzo": true })} </div>`, title, renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-bvzihdzo": true }));
}, "/Users/dominickryan/astro_blog/astro_blog/src/layouts/BlogPost.astro", void 0);
export {
  $$BlogPost as $
};
