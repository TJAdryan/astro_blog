import { c as createComponent, a as createAstro, d as addAttribute, h as renderScript, b as renderTemplate } from "./astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import "clsx";
/* empty css                         */
import { a as SITE_TITLE } from "./consts_DLzDSCUC.mjs";
const FallbackImage = new Proxy({ "src": "/_astro/blog-placeholder-1.Bx0Zcyzv.jpg", "width": 960, "height": 480, "format": "jpg" }, {
  get(target, name, receiver) {
    if (name === "clone") {
      return structuredClone(target);
    }
    if (name === "fsPath") {
      return "/Users/dominickryan/astro_blog/astro_blog/src/assets/blog-placeholder-1.jpg";
    }
    return target[name];
  }
});
const $$Astro = createAstro();
const $$BaseHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  const { title, description, image = FallbackImage } = Astro2.props;
  return renderTemplate`<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="sitemap" href="/sitemap-index.xml"><link rel="alternate" type="application/rss+xml"${addAttribute(SITE_TITLE, "title")}${addAttribute(new URL("rss.xml", Astro2.site), "href")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- Font preloads --><link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="/fonts/atkinson-bold.woff" as="font" type="font/woff" crossorigin><!-- Canonical URL --><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Primary Meta Tags --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(Astro2.url, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(image.src, Astro2.url), "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(Astro2.url, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(new URL(image.src, Astro2.url), "content")}><!-- Mermaid -->${renderScript($$result, "/Users/dominickryan/astro_blog/astro_blog/src/components/BaseHead.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "/Users/dominickryan/astro_blog/astro_blog/src/components/BaseHead.astro?astro&type=script&index=1&lang.ts")}`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/components/BaseHead.astro", void 0);
export {
  $$BaseHead as $
};
