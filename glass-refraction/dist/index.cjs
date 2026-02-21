"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Glass: () => Glass,
  GlassCard: () => GlassCard,
  GlassFilters: () => GlassFilters,
  GlassPill: () => GlassPill
});
module.exports = __toCommonJS(index_exports);

// src/react/GlassFilters.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function GlassFilters({
  scale = 8,
  strongScale = 16,
  baseFrequency = "0.015 0.012",
  numOctaves = 2,
  seed = 42
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "0",
      height: "0",
      style: { position: "absolute", overflow: "hidden" },
      "aria-hidden": true,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "filter",
          {
            id: "glass-refract",
            x: "-5%",
            y: "-5%",
            width: "110%",
            height: "110%",
            colorInterpolationFilters: "sRGB",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "0.3", result: "preblur" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "feTurbulence",
                {
                  type: "fractalNoise",
                  baseFrequency,
                  numOctaves,
                  seed,
                  result: "noise"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", { in: "noise", stdDeviation: "3", result: "smooth" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "feDisplacementMap",
                {
                  in: "preblur",
                  in2: "smooth",
                  scale,
                  xChannelSelector: "R",
                  yChannelSelector: "G",
                  result: "displaced"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feColorMatrix", { in: "displaced", type: "saturate", values: "1.3" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "filter",
          {
            id: "glass-refract-strong",
            x: "-5%",
            y: "-5%",
            width: "110%",
            height: "110%",
            colorInterpolationFilters: "sRGB",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "0.4", result: "preblur" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "feTurbulence",
                {
                  type: "fractalNoise",
                  baseFrequency: "0.012 0.010",
                  numOctaves: Math.min(numOctaves + 1, 4),
                  seed,
                  result: "noise"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", { in: "noise", stdDeviation: "4", result: "smooth" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "feDisplacementMap",
                {
                  in: "preblur",
                  in2: "smooth",
                  scale: strongScale,
                  xChannelSelector: "R",
                  yChannelSelector: "G",
                  result: "displaced"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feColorMatrix", { in: "displaced", type: "saturate", values: "1.5" })
            ]
          }
        )
      ] })
    }
  );
}

// src/react/Glass.tsx
var import_react = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var Glass = (0, import_react.forwardRef)(function Glass2({ as: Tag = "div", className, variant = "glass", children, ...rest }, ref) {
  const classes = [variant, className].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tag, { ref, className: classes, ...rest, children });
});

// src/react/GlassCard.tsx
var import_react2 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var GlassCard = (0, import_react2.forwardRef)(function GlassCard2({ as: Tag = "div", className, hoverable = true, children, ...rest }, ref) {
  const classes = [
    "glass-card",
    !hoverable && "glass-card--no-hover",
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tag, { ref, className: classes, ...rest, children });
});

// src/react/GlassPill.tsx
var import_react3 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var GlassPill = (0, import_react3.forwardRef)(function GlassPill2({ as: Tag = "span", className, children, ...rest }, ref) {
  const classes = ["glass-pill", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Tag, { ref, className: classes, ...rest, children });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Glass,
  GlassCard,
  GlassFilters,
  GlassPill
});
//# sourceMappingURL=index.cjs.map