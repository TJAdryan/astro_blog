import { c as createComponent, b as renderTemplate, f as renderSlot, e as renderHead, g as defineScriptVars } from "./astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import "clsx";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$PostHogLayout = createComponent(($$result, $$props, $$slots) => {
  const apiKey = "phc_vdYLX21Ll0XCkaFOVXiCfzRE9w4WJ7Hfi6vXwsRKfPU";
  return renderTemplate(_a || (_a = __template([`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- PostHog Analytics --><script type="text/javascript">
      !(function(t, e) {
        var o, n, p, r;
        e.__SV ||
          ((window.posthog = e),
          (e._i = []),
          (e.init = function(i, s, a) {
            function g(t, e) {
              var o = e.split('.');
              2 == o.length && ((t = t[o[0]]), (e = o[1])),
                (t[e] = function() {
                  t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                });
            }
            ((p = t.createElement('script')).type = 'text/javascript'),
              (p.crossOrigin = 'anonymous'),
              (p.async = true),
              (p.src = s.api_host + '/static/array.js'),
              (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
            var u = e;
            void 0 !== a ? (u = e[a] = []) : (a = 'posthog');
            u.people = u.people || [];
            u.toString = function(t) {
              var e = 'posthog';
              return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
            };
            u.people.toString = function() {
              return u.toString(1) + '.people (stub)';
            };
            o =
              'capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId'.split(
                ' '
              );
            for (n = 0; n < o.length; n++) g(u, o[n]);
            e._i.push([i, s, a]);
          }),
          (e.__SV = 1));
      })(document, window.posthog || []);
    <\/script><script>(function(){`, "\n      posthog.init(apiKey, { \n        api_host: 'https://us.i.posthog.com'\n      });\n    })();<\/script>", "</head> <body> ", " </body></html>"])), defineScriptVars({ apiKey }), renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/dominickryan/astro_blog/astro_blog/src/layouts/PostHogLayout.astro", void 0);
export {
  $$PostHogLayout as $
};
