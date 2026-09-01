/* ============================================================
   UTILS — small shared helpers. No dependencies.
   ============================================================ */
window.PF = window.PF || {};

PF.utils = (function () {
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const finePointer = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* rAF-throttled scroll subscription: one listener for the whole site */
  const scrollSubs = [];
  let ticking = false;

  function onFrame() {
    ticking = false;
    const y = window.scrollY || window.pageYOffset;
    for (let i = 0; i < scrollSubs.length; i++) scrollSubs[i](y);
  }

  function requestFrame() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onFrame);
    }
  }

  function onScroll(fn) {
    scrollSubs.push(fn);
    return fn;
  }

  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame, { passive: true });

  /* single shared pointer position, updated passively */
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, nx: 0, ny: 0 };
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  /* reveal observer: adds .is-in once, then unobserves */
  function observe(elements, cb, options) {
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => cb(el, true));
      return null;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cb(entry.target, true);
          io.unobserve(entry.target);
        }
      });
    }, Object.assign({ rootMargin: "0px 0px -12% 0px", threshold: 0.12 }, options));
    elements.forEach((el) => io.observe(el));
    return io;
  }

  function track(elements, onEnter, onLeave) {
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => onEnter(el));
      return null;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onEnter(entry.target);
          else if (onLeave) onLeave(entry.target);
        });
      },
      { rootMargin: "20% 0px 20% 0px", threshold: 0 }
    );
    elements.forEach((el) => io.observe(el));
    return io;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  /* drag helper shared by the skills field and the lab */
  function draggable(el, opts) {
    const o = Object.assign({ bounds: null, onStart: null, onEnd: null }, opts);
    let id = null;
    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 0;
    let moved = false;

    el.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      id = e.pointerId;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      baseX = o.getX();
      baseY = o.getY();
      el.setPointerCapture(id);
      el.classList.add("is-dragging");
      if (o.onStart) o.onStart();
    });

    el.addEventListener("pointermove", (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      let nx = baseX + dx;
      let ny = baseY + dy;
      if (o.bounds) {
        const b = o.bounds();
        nx = clamp(nx, b.minX, b.maxX);
        ny = clamp(ny, b.minY, b.maxY);
      }
      o.set(nx, ny);
    });

    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      el.classList.remove("is-dragging");
      if (o.onEnd) o.onEnd(moved);
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  return {
    qs, qsa, clamp, lerp, reduced, finePointer,
    onScroll, requestFrame, pointer, observe, track, escapeHTML, draggable,
  };
})();
