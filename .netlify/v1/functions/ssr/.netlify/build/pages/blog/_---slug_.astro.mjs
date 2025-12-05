/* empty css                                    */
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate } from "../../chunks/astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { g as getCollection } from "../../chunks/_astro_content_CZp46OTV.mjs";
import { $ as $$PostHogLayout } from "../../chunks/PostHogLayout_C_-ndRg9.mjs";
import { $ as $$BlogPost } from "../../chunks/BlogPost_M3E004x3.mjs";
import { renderers } from "../../renderers.mjs";
const $$Astro = createAstro();
async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const post = Astro2.props;
  const { Content } = await post.render();
  return renderTemplate`${renderComponent($$result, "PostHogLayout", $$PostHogLayout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "BlogPost", $$BlogPost, { ...post.data }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Content", Content, {})} ` })} ` })}`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/pages/blog/[...slug].astro", void 0);
const $$file = "/Users/dominickryan/astro_blog/astro_blog/src/pages/blog/[...slug].astro";
const $$url = "/blog/[...slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
