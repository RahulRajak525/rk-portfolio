// Loaded asynchronously by <LazyMotion> so animation code never blocks
// first paint or hydration. domAnimation covers animate/variants/inView/
// gestures; upgrade to domMax only if layout animations are introduced.
import { domAnimation } from "motion/react";

export default domAnimation;
