import { p as createVNode, G as Fragment, _ as __astro_tag_component__ } from "./astro/server_C7Z9Vbd7.mjs";
import { H as HousingSimulation } from "./HousingSimulation_B5Y3F42g.mjs";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import "clsx";
function SimulationInstructions() {
  const [show, setShow] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-col items-center w-full", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "px-4 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-auto",
        onClick: () => setShow((s) => !s),
        "aria-expanded": show,
        "aria-controls": "sim-instructions",
        children: show ? "Hide Instructions" : "Show Instructions"
      }
    ),
    show && /* @__PURE__ */ jsxs(
      "div",
      {
        id: "sim-instructions",
        className: "prose prose-blue bg-gray-50 border border-gray-200 rounded p-4 shadow-sm w-full max-w-7xl mx-auto px-4",
        children: [
          /* @__PURE__ */ jsx("h3", { children: "How to Use the Housing Market Simulation" }),
          /* @__PURE__ */ jsxs("ol", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Adjust Simulation Inputs" }),
              /* @__PURE__ */ jsxs("ul", { children: [
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Sale Turnover (%)" }),
                  ": The percent of homes that go up for sale each year."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "New Homes / Year" }),
                  ": How many new homes are built each year."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Initial Seekers" }),
                  ": Number of people/families looking for housing at the start."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Landlord Cap (%)" }),
                  ": The maximum percent of homes that can be owned by landlords."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Homeowners" }),
                  ": Initial number of homes owned by homeowners."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Landlords" }),
                  ": Initial number of homes owned by landlords."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Years to Run" }),
                  ": How many years the simulation will run when started."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Run or Pause the Simulation" }),
              /* @__PURE__ */ jsxs("ul", { children: [
                /* @__PURE__ */ jsxs("li", { children: [
                  "Click the ",
                  /* @__PURE__ */ jsx("strong", { children: "Run" }),
                  " button to start the simulation. The button will change to ",
                  /* @__PURE__ */ jsx("strong", { children: "Pause" }),
                  " while running."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  "Click ",
                  /* @__PURE__ */ jsx("strong", { children: "Pause" }),
                  " to stop the simulation at any time."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Advance Year or Reset" }),
              /* @__PURE__ */ jsxs("ul", { children: [
                /* @__PURE__ */ jsxs("li", { children: [
                  "Use ",
                  /* @__PURE__ */ jsx("strong", { children: "Advance Year" }),
                  " to step forward one year at a time (only when paused)."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  "Use ",
                  /* @__PURE__ */ jsx("strong", { children: "Reset" }),
                  " to return all settings and the simulation to their starting values."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Trigger Mortgage Collapse" }),
              /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsxs("li", { children: [
                "Click ",
                /* @__PURE__ */ jsx("strong", { children: "Trigger Mortgage Collapse" }),
                " to simulate a year with a high rate of foreclosures (only available when paused)."
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "View Results" }),
              /* @__PURE__ */ jsxs("ul", { children: [
                /* @__PURE__ */ jsx("li", { children: "The dashboard shows:" }),
                /* @__PURE__ */ jsxs("ul", { children: [
                  /* @__PURE__ */ jsx("li", { children: "Current market stats (population, seekers, home prices, rents, incomes, etc.)." }),
                  /* @__PURE__ */ jsx("li", { children: "A visual grid of all homes, color-coded by status and type." }),
                  /* @__PURE__ */ jsx("li", { children: "Cumulative market activity (purchases, conversions, displacements)." })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Legend" }),
              /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: "Colored dots explain the meaning of each home type/status in the visual grid." }) })
            ] })
          ] })
        ]
      }
    )
  ] });
}
const frontmatter = {
  "title": "Interactive Housing Market Simulation",
  "description": "An interactive sandbox to explore the forces of supply, demand, and investment in the housing market.",
  "pubDate": "2025-09-07",
  "tags": ["housing-simulation"]
};
function getHeadings() {
  return [];
}
function _createMdxContent(props) {
  const _components = {
    p: "p",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "This is an interactive simulation of a housing market, allowing users to explore various scenarios and their impacts on the market. You can adjust the variables below and run the simulation to see how the market responds in over several years to changes in demand, housing supply, and more."
    }), "\n", createVNode(SimulationInstructions, {
      "client:load": true,
      "client:component-path": "@/components/HousingSim/SimulationInstructions.jsx",
      "client:component-export": "default",
      "client:component-hydration": true
    }), "\n", createVNode(HousingSimulation, {
      "client:load": true,
      "client:component-path": "@/components/HousingSim/HousingSimulation.jsx",
      "client:component-export": "default",
      "client:component-hydration": true
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
const url = "src/content/blog/interactive-housing-simulation.mdx";
const file = "/Users/dominickryan/astro_blog/astro_blog/src/content/blog/interactive-housing-simulation.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment, ...props.components }
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/dominickryan/astro_blog/astro_blog/src/content/blog/interactive-housing-simulation.mdx";
__astro_tag_component__(Content, "astro:jsx");
export {
  Content,
  Content as default,
  file,
  frontmatter,
  getHeadings,
  url
};
