/* ============================================================
   MAGNETIC — elements lean toward the pointer while hovered.
   Transform only. Skipped on touch + reduced motion.
   ============================================================ */
window.PF = window.PF || {};

PF.magnetic = (function () {
  const U = PF.utils;
  const items = [];
  let active = false;

  function register(el, strength) {
    if (!el) return;
    const data = {
      el: el,
      strength: strength || parseFloat(el.getAttribute("data-magnetic")) || 0.35,
      tx: 0,
      ty: 0,
      cx: 0,
      cy: 0,
      hover: false,
    };
    items.push(data);

    el.addEventListener(
      "pointerenter",
      () => {
        data.hover = true;
        el.style.willChange = "transform";
        if (!active) {
          active = true;
          requestAnimationFrame(loop);
        }
      },
      { passive: true }
    );

    el.addEventListener(
      "pointerleave",
      () => {
        data.hover = false;
        data.tx = 0;
        data.ty = 0;
        el.style.willChange = "";
      },
      { passive: true }
    );

    el.addEventListener(
      "pointermove",
      (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        data.tx = dx * data.strength;
        data.ty = dy * data.strength;
      },
      { passive: true }
    );
  }

  function loop() {
    let busy = false;
    for (let i = 0; i < items.length; i++) {
      const d = items[i];
      d.cx = U.lerp(d.cx, d.tx, 0.16);
      d.cy = U.lerp(d.cy, d.ty, 0.16);
      const settled =
        Math.abs(d.cx - d.tx) < 0.05 && Math.abs(d.cy - d.ty) < 0.05;
      if (settled && !d.hover) {
        if (d.el.style.transform) d.el.style.transform = "";
        continue;
      }
      busy = true;
      d.el.style.transform =
        "translate3d(" + d.cx.toFixed(2) + "px," + d.cy.toFixed(2) + "px,0)";
    }
    if (!busy) {
      active = false; /* idle: no rAF burn */
      return;
    }
    requestAnimationFrame(loop);
  }

  function init() {
    if (U.reduced() || !U.finePointer()) return;
    U.qsa("[data-magnetic]").forEach((el) => register(el));
  }

  return { init: init, register: register };
})();
