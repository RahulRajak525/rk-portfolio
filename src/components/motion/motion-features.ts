// Loaded asynchronously by <LazyMotion> so animation code never blocks
// first paint or hydration. domMax adds layout animations on top of
// domAnimation — used for shared-element indicators (nav, filters).
import { domMax } from "motion/react";

export default domMax;
