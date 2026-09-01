/* ============================================================
   SMOOTH SCROLL — native scrolling only.
   The custom lerp engine was removed: it intercepted the wheel and
   fought the browser's own scroll, which felt laggy. Anchor jumps
   and the back-to-top button now use the browser's native smooth
   behaviour (one-shot, never per-frame), so they stay smooth.
   ============================================================ */
window.PF = window.PF || {};

PF.smooth = (function () {
  function scrollToY(y, instant) {
    window.scrollTo({ top: y, behavior: instant ? "auto" : "smooth" });
  }

  return {
    init: function () {},
    enable: function () {},
    disable: function () {},
    isOn: function () { return false; },
    animating: function () { return false; },
    scrollTo: scrollToY,
    refresh: function () {},
  };
})();
