/* ============================================================
   HERO — pointer-reactive workspace stage + ambient grid.
   Transform-only, one rAF loop, parked when the hero is off screen.
   ============================================================ */
window.PF = window.PF || {};

PF.hero = (function () {
  const U = PF.utils;
  const items = [];
  let hero = null;
  let visible = true;
  let running = false;
  let mx = 0;
  let my = 0;
  let cx = 0;
  let cy = 0;

  function collect() {
    U.qsa(".stage__el").forEach((el) => {
      const depth = parseFloat(el.getAttribute("data-depth")) || 12;
      items.push({ el: el, depth: depth, rot: (parseFloat(el.getAttribute("data-rot")) || 0) });
    });
  }

  function loop() {
    if (!running) return;
    const p = U.pointer;
    mx = p.nx;
    my = p.ny;
    cx = U.lerp(cx, mx, 0.06);
    cy = U.lerp(cy, my, 0.06);

    /* ambient background reacts to the same pointer */
    const root = document.documentElement.style;
    root.setProperty("--mx", cx.toFixed(3));
    root.setProperty("--my", cy.toFixed(3));
    root.setProperty("--px", U.pointer.x + "px");
    root.setProperty("--py", U.pointer.y + "px");

    if (visible) {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const tx = cx * it.depth;
        const ty = cy * it.depth;
        it.el.style.transform =
          "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0) rotate(" +
          (it.rot + cx * 0.8).toFixed(2) + "deg)";
      }
    }
    requestAnimationFrame(loop);
  }

  function init() {
    hero = U.qs(".hero");
    collect();
    if (U.reduced()) {
      document.documentElement.style.setProperty("--mx", 0);
      document.documentElement.style.setProperty("--my", 0);
      return;
    }
    if (hero) {
      U.track(
        [hero],
        () => { visible = true; if (!running) { running = true; requestAnimationFrame(loop); } },
        () => { visible = false; running = false; }
      );
    }
    running = true;
    requestAnimationFrame(loop);
  }

  return { init: init };
})();
