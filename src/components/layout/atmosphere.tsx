/**
 * Fixed atmospheric backdrop: two slow aurora fields (ion + plasma), film
 * grain and a vignette. Pure CSS (see src/styles/effects.css) — no JS, no
 * filters, transform-only drift; static under reduced motion. The
 * __shift wrappers re-light the scene per section (html[data-section]).
 */
export function Atmosphere() {
  return (
    <div aria-hidden="true" data-decorative className="atmosphere">
      <div className="atmosphere__shift atmosphere__shift--ion">
        <div className="atmosphere__aurora atmosphere__aurora--ion" />
      </div>
      <div className="atmosphere__shift atmosphere__shift--plasma">
        <div className="atmosphere__aurora atmosphere__aurora--plasma" />
      </div>
      <div className="atmosphere__noise" />
      <div className="atmosphere__vignette" />
    </div>
  );
}
