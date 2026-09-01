/* ============================================================
   SERVICES — restrained pointer tilt. Max 4°, transform only,
   rAF loop parked when nothing is hovered.
   ============================================================ */
window.PF = window.PF || {};

PF.services = (function () {
  const U = PF.utils;
  const cards = [];
  let running = false;

  function loop() {
    let busy = false;
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      c.cx = U.lerp(c.cx, c.tx, 0.12);
      c.cy = U.lerp(c.cy, c.ty, 0.12);
      c.cl = U.lerp(c.cl, c.tl, 0.12);
      const settled =
        Math.abs(c.cx - c.tx) < 0.02 &&
        Math.abs(c.cy - c.ty) < 0.02 &&
        Math.abs(c.cl - c.tl) < 0.01;
      if (settled && !c.hover) {
        if (c.el.style.transform) c.el.style.transform = "";
        continue;
      }
      busy = true;
      c.el.style.transform =
        "perspective(900px) rotateX(" + c.cy.toFixed(2) + "deg) rotateY(" +
        c.cx.toFixed(2) + "deg) translate3d(0," + (-c.cl * 6).toFixed(2) + "px,0)";
    }
    running = busy;
    if (busy) requestAnimationFrame(loop);
  }

  function kick() {
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }

  function register(el) {
    const c = { el: el, cx: 0, cy: 0, cl: 0, tx: 0, ty: 0, tl: 0, hover: false };
    cards.push(c);

    el.addEventListener("pointerenter", () => { c.hover = true; kick(); }, { passive: true });

    el.addEventListener(
      "pointermove",
      (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        c.tx = px * 8;
        c.ty = -py * 8;
        c.tl = 1;
      },
      { passive: true }
    );

    el.addEventListener(
      "pointerleave",
      () => { c.hover = false; c.tx = 0; c.ty = 0; c.tl = 0; kick(); },
      { passive: true }
    );
  }

  function init() {
    if (U.reduced() || !U.finePointer()) return;
    U.qsa(".service").forEach(register);
  }

  return { init: init, register: register };
})();
