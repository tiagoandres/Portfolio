// src/react/GlassFilters.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function GlassFilters({
  scale = 8,
  strongScale = 16,
  baseFrequency = "0.015 0.012",
  numOctaves = 2,
  seed = 42
}) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "0",
      height: "0",
      style: { position: "absolute", overflow: "hidden" },
      "aria-hidden": true,
      children: /* @__PURE__ */ jsxs("defs", { children: [
        /* @__PURE__ */ jsxs(
          "filter",
          {
            id: "glass-refract",
            x: "-5%",
            y: "-5%",
            width: "110%",
            height: "110%",
            colorInterpolationFilters: "sRGB",
            children: [
              /* @__PURE__ */ jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "0.3", result: "preblur" }),
              /* @__PURE__ */ jsx(
                "feTurbulence",
                {
                  type: "fractalNoise",
                  baseFrequency,
                  numOctaves,
                  seed,
                  result: "noise"
                }
              ),
              /* @__PURE__ */ jsx("feGaussianBlur", { in: "noise", stdDeviation: "3", result: "smooth" }),
              /* @__PURE__ */ jsx(
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
              /* @__PURE__ */ jsx("feColorMatrix", { in: "displaced", type: "saturate", values: "1.3" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "filter",
          {
            id: "glass-refract-strong",
            x: "-5%",
            y: "-5%",
            width: "110%",
            height: "110%",
            colorInterpolationFilters: "sRGB",
            children: [
              /* @__PURE__ */ jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "0.4", result: "preblur" }),
              /* @__PURE__ */ jsx(
                "feTurbulence",
                {
                  type: "fractalNoise",
                  baseFrequency: "0.012 0.010",
                  numOctaves: Math.min(numOctaves + 1, 4),
                  seed,
                  result: "noise"
                }
              ),
              /* @__PURE__ */ jsx("feGaussianBlur", { in: "noise", stdDeviation: "4", result: "smooth" }),
              /* @__PURE__ */ jsx(
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
              /* @__PURE__ */ jsx("feColorMatrix", { in: "displaced", type: "saturate", values: "1.5" })
            ]
          }
        )
      ] })
    }
  );
}

// src/react/Glass.tsx
import { forwardRef } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var Glass = forwardRef(function Glass2({ as: Tag = "div", className, variant = "glass", children, ...rest }, ref) {
  const classes = [variant, className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx2(Tag, { ref, className: classes, ...rest, children });
});

// src/react/GlassCard.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var GlassCard = forwardRef2(function GlassCard2({ as: Tag = "div", className, hoverable = true, children, ...rest }, ref) {
  const classes = [
    "glass-card",
    !hoverable && "glass-card--no-hover",
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx3(Tag, { ref, className: classes, ...rest, children });
});

// src/react/GlassPill.tsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var GlassPill = forwardRef3(function GlassPill2({ as: Tag = "span", className, children, ...rest }, ref) {
  const classes = ["glass-pill", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx4(Tag, { ref, className: classes, ...rest, children });
});
export {
  Glass,
  GlassCard,
  GlassFilters,
  GlassPill
};
//# sourceMappingURL=index.js.map