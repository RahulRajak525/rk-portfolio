/** First focusable element on every page: jumps keyboard users past the nav. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed top-3 left-3 z-(--z-skip) rounded-full bg-accent px-5 py-3 text-body-sm font-medium text-on-accent shadow-glow"
    >
      Skip to content
    </a>
  );
}
