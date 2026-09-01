/* ============================================================
   LOADER — short, honest sequence. Never blocks the page:
   if assets are already cached it finishes early.
   ============================================================ */
window.PF = window.PF || {};

PF.loader = (function () {
  const U = PF.utils;

  const STEPS = ["Loading interface", "Connecting projects", "Ready"];

  function init(onDone) {
    const root = U.qs(".loader");
    if (!root) {
      onDone();
      return;
    }
    const fill = U.qs(".loader__fill", root);
    const pct = U.qs(".loader__pct", root);
    const steps = U.qsa(".loader__step", root);

    let p = 0;
    let step = 0;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      steps.forEach((s) => s.setAttribute("data-state", "done"));
      if (fill) fill.style.transform = "scaleX(1)";
      if (pct) pct.textContent = "100";
      root.classList.add("is-done");
      document.documentElement.classList.remove("is-locked");
      setTimeout(() => {
        root.remove();
      }, 1000);
      onDone();
      PF.smooth.refresh();
    };

    const setStep = (i) => {
      steps.forEach((s, idx) => {
        s.setAttribute("data-state", idx < i ? "done" : idx === i ? "active" : "idle");
      });
    };

    setStep(0);

    /* jump to real progress as assets land, then ease the rest */
    window.addEventListener("load", () => { p = Math.max(p, 82); }, { once: true });

    const total = U.reduced() ? 400 : 1700;
    const t0 = performance.now();

    (function tick(now) {
      const elapsed = now - t0;
      const target = U.clamp((elapsed / total) * 100, 0, 100);
      p = Math.max(p, target);
      const shown = Math.min(99, Math.round(p));
      if (fill) fill.style.transform = "scaleX(" + (shown / 100).toFixed(3) + ")";
      if (pct) pct.textContent = String(shown);
      const nextStep = shown < 40 ? 0 : shown < 80 ? 1 : 2;
      if (nextStep !== step) {
        step = nextStep;
        setStep(step);
      }
      if (p >= 100 && elapsed > 700) {
        finish();
        return;
      }
      requestAnimationFrame(tick);
    })(t0);

    /* hard ceiling — the site is never held hostage by the loader */
    setTimeout(finish, 3200);
  }

  return { init: init };
})();
