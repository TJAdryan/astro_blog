import { c as createComponent, a as createAstro, m as maybeRenderHead, d as addAttribute, b as renderTemplate } from "./astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import "clsx";
const $$Astro = createAstro();
const $$FormattedDate = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FormattedDate;
  const { date } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<time${addAttribute(date.toISOString(), "datetime")}> ${date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })} </time>`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/components/FormattedDate.astro", void 0);
export {
  $$FormattedDate as $
};
