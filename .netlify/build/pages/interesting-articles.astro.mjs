/* empty css                                 */
import { c as createComponent, b as renderTemplate, r as renderComponent, m as maybeRenderHead } from "../chunks/astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { $ as $$BaseLayout } from "../chunks/BaseLayout__fXPCThu.mjs";
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$InterestingArticles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ` <script>
  // Fetch and render ALL articles from the JSON file
  document.addEventListener('DOMContentLoaded', function() {
    fetch('/data/articles.json')
      .then(res => res.json())
      .then(articles => {
        const ul = document.getElementById('all-articles-list');
        if (ul) {
          ul.innerHTML = '';
          articles.forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = \`<a href="\${article.url}" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">\${article.title}</a><span class="text-gray-500 dark:text-gray-400"> — \${article.author} [\${article.area}]</span>\`;
            ul.appendChild(li);
          });
        }
      });
  });
<\/script>`], ["", ` <script>
  // Fetch and render ALL articles from the JSON file
  document.addEventListener('DOMContentLoaded', function() {
    fetch('/data/articles.json')
      .then(res => res.json())
      .then(articles => {
        const ul = document.getElementById('all-articles-list');
        if (ul) {
          ul.innerHTML = '';
          articles.forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = \\\`<a href="\\\${article.url}" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">\\\${article.title}</a><span class="text-gray-500 dark:text-gray-400"> — \\\${article.author} [\\\${article.area}]</span>\\\`;
            ul.appendChild(li);
          });
        }
      });
  });
<\/script>`])), renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container"> <h1 class="text-3xl font-bold mb-4">Interesting Articles</h1> <p class="text-gray-600 dark:text-gray-300 mb-8">
A collection of seminal articles, recent innovations, and other papers I found interesting.
</p> <ul id="all-articles-list" class="list-disc pl-5 space-y-2"> <!-- All articles will be rendered by client-side JS --> </ul> </div> ` }));
}, "/Users/dominickryan/astro_blog/astro_blog/src/pages/interesting-articles.astro", void 0);
const $$file = "/Users/dominickryan/astro_blog/astro_blog/src/pages/interesting-articles.astro";
const $$url = "/interesting-articles";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$InterestingArticles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
