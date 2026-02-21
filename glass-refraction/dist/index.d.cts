import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ElementType, ComponentPropsWithoutRef } from 'react';

interface GlassFiltersProps {
    /** Displacement scale for subtle refraction (default: 8) */
    scale?: number;
    /** Displacement scale for strong refraction (default: 16) */
    strongScale?: number;
    /** Turbulence base frequency as "x y" (default: "0.015 0.012") */
    baseFrequency?: string;
    /** Number of noise octaves (default: 2) */
    numOctaves?: number;
    /** Turbulence seed (default: 42) */
    seed?: number;
}
/**
 * Renders hidden SVG `<defs>` providing two refraction filters:
 * - `#glass-refract` — subtle, for general use
 * - `#glass-refract-strong` — stronger, for hero/special elements
 *
 * Place once near the root of your app.
 *
 * Apply via CSS:
 * ```css
 * .my-element { filter: url(#glass-refract); }
 * ```
 */
declare function GlassFilters({ scale, strongScale, baseFrequency, numOctaves, seed, }: GlassFiltersProps): react_jsx_runtime.JSX.Element;

type GlassVariant = "glass" | "glass-card" | "glass-pill";
type GlassProps<T extends ElementType = "div"> = {
    /** HTML element to render (default: "div") */
    as?: T;
    /** Additional class names */
    className?: string;
    /** Override the glass tier class (default: "glass") */
    variant?: GlassVariant;
    children?: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;
/**
 * Generic `<Glass>` wrapper — renders a `.glass` element by default.
 *
 * ```tsx
 * <Glass as="nav" className="px-4">Navbar</Glass>
 * ```
 */
declare const Glass: <T extends ElementType = "div">(props: GlassProps<T> & {
    ref?: React.Ref<HTMLElement>;
}) => React.ReactElement | null;

type GlassCardProps<T extends ElementType = "div"> = {
    /** HTML element to render (default: "div") */
    as?: T;
    /** Additional class names */
    className?: string;
    /** Enable hover lift effect (default: true) */
    hoverable?: boolean;
    children?: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;
/**
 * `<GlassCard>` — medium-density glass for content cards.
 *
 * ```tsx
 * <GlassCard className="p-6">
 *   <h2>Card title</h2>
 *   <p>Card body</p>
 * </GlassCard>
 * ```
 */
declare const GlassCard: <T extends ElementType = "div">(props: GlassCardProps<T> & {
    ref?: React.Ref<HTMLElement>;
}) => React.ReactElement | null;

type GlassPillProps<T extends ElementType = "span"> = {
    /** HTML element to render (default: "span") */
    as?: T;
    /** Additional class names */
    className?: string;
    children?: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;
/**
 * `<GlassPill>` — lightweight glass for tags, badges, and pills.
 *
 * ```tsx
 * <GlassPill className="px-3 py-1 text-sm">React</GlassPill>
 * ```
 */
declare const GlassPill: <T extends ElementType = "span">(props: GlassPillProps<T> & {
    ref?: React.Ref<HTMLElement>;
}) => React.ReactElement | null;

export { Glass, GlassCard, type GlassCardProps, GlassFilters, type GlassFiltersProps, GlassPill, type GlassPillProps, type GlassProps };
