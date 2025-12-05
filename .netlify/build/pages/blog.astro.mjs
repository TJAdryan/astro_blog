/* empty css                                 */
import { c as createComponent, b as renderTemplate, r as renderComponent, m as maybeRenderHead, d as addAttribute } from "../chunks/astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { $ as $$PostHogLayout } from "../chunks/PostHogLayout_C_-ndRg9.mjs";
import { Image as $$Image } from "../chunks/_astro_assets_DKE-QtcE.mjs";
import { g as getCollection } from "../chunks/_astro_content_CZp46OTV.mjs";
import { $ as $$BaseHead } from "../chunks/BaseHead_mYQ8vpBh.mjs";
import { $ as $$Header, a as $$Footer } from "../chunks/Header_zAAgypot.mjs";
import { $ as $$FormattedDate } from "../chunks/FormattedDate_jFLUYorq.mjs";
import { S as SITE_DESCRIPTION, a as SITE_TITLE } from "../chunks/consts_DLzDSCUC.mjs";
import "clsx";
/* empty css                                 */
import { renderers } from "../renderers.mjs";
const $$UnknownPlateWidget = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- UnknownPlateWidget removed per request. -->`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/components/UnknownPlateWidget.astro", void 0);
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return renderTemplate`${renderComponent($$result, "BaseHead", $$BaseHead, { "title": SITE_TITLE, "description": SITE_DESCRIPTION, "data-astro-cid-5tznm7mj": true })}  ${renderComponent($$result, "PostHogLayout", $$PostHogLayout, { "data-astro-cid-5tznm7mj": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-5tznm7mj": true })} ${renderComponent($$result2, "UnknownPlateWidget", $$UnknownPlateWidget, { "data-astro-cid-5tznm7mj": true })} ${maybeRenderHead()}<div class="container" data-astro-cid-5tznm7mj> <div class="hero-section" data-astro-cid-5tznm7mj> <!-- ...existing hero content... --> </div> <main data-astro-cid-5tznm7mj> <section data-astro-cid-5tznm7mj> <ul data-astro-cid-5tznm7mj> ${posts.map((post) => renderTemplate`<li data-astro-cid-5tznm7mj> <a${addAttribute(`/blog/${post.slug}/`, "href")} data-astro-cid-5tznm7mj> ${post.data.heroImage && renderTemplate`${renderComponent($$result2, "Image", $$Image, { "width": 720, "height": 360, "src": post.data.heroImage, "alt": "", "data-astro-cid-5tznm7mj": true })}`} <h4 class="title" data-astro-cid-5tznm7mj>${post.data.title}</h4> <p class="date" data-astro-cid-5tznm7mj> ${renderComponent($$result2, "FormattedDate", $$FormattedDate, { "date": post.data.pubDate, "data-astro-cid-5tznm7mj": true })} </p> </a> </li>`)} </ul> </section> </main> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-5tznm7mj": true })} ` })}`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/pages/blog/index.astro", void 0);
const $$file = "/Users/dominickryan/astro_blog/astro_blog/src/pages/blog/index.astro";
const $$url = "/blog";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
