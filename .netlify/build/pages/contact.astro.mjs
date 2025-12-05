/* empty css                                 */
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { $ as $$PostHogLayout } from "../chunks/PostHogLayout_C_-ndRg9.mjs";
import { $ as $$BaseLayout } from "../chunks/BaseLayout__fXPCThu.mjs";
import { renderers } from "../renderers.mjs";
const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PostHogLayout", $$PostHogLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "BaseLayout", $$BaseLayout, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="container"> <h1 class="text-4xl font-bold mb-4">Contact</h1> <p class="mb-8 text-lg text-gray-600 dark:text-gray-400">
I'm always keen to connect with fellow data enthusiasts, developers, and anyone interested in the topics I write about.
</p> <div class="space-y-6"> <!-- Email Contact --> <div class="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800"> <div class="mb-2"> <svg width="64" height="64" class="mb-2" fill="currentColor" viewBox="0 0 20 20"> <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path> <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">Email</h3> <p class="text-gray-700 dark:text-gray-300 mb-3">
The best way to reach me for questions, feedback, or just to say hello.
</p> <a href="mailto:dominick@nextvaldata.com" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
dominick@nextvaldata.com
</a> </div> <!-- Social Media --> <div class="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800"> <div class="mb-2"> <svg width="64" height="64" class="mb-2" fill="currentColor" viewBox="0 0 20 20"> <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path> <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">GitHub</h3> <p class="text-gray-700 dark:text-gray-300 mb-3">
Check out my code, projects, and contributions.
</p> <a href="https://github.com/tjadryan" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
github.com/tjadryan
</a> </div> <!-- What to Contact About --> <div class="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800"> <h3 class="text-xl font-semibold mb-2">What to Contact Me About</h3> <ul class="text-gray-700 dark:text-gray-300 space-y-2"> <li>Questions about my blog posts or technical content</li> <li>Data engineering discussions and experiences</li> <li>Collaboration opportunities</li> <li>Feedback on articles or the site</li> <li>Book recommendations (especially history or technical books)</li> <li>NYC recommendations or meetups</li> <li>General data and analytics chat</li> </ul> </div> <!-- Response Time --> <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"> <p class="text-blue-800 dark:text-blue-200"> <strong>Response Time:</strong> I typically respond to emails within 1-2 business days. 
            Feel free to follow up if you don't hear back!
</p> </div> </div> </div> ` })} ` })}`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/pages/contact.astro", void 0);
const $$file = "/Users/dominickryan/astro_blog/astro_blog/src/pages/contact.astro";
const $$url = "/contact";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
