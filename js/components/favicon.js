/* ============================================================
   FAVICON — subtle "available" pulse in the browser tab.
   Swaps between two tiny SVG frames; static under reduced motion.
   ============================================================ */
window.PF = window.PF || {};

PF.favicon = (function () {
  const U = PF.utils;

  function frame(dotOpacity) {
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
      "<rect width='64' height='64' rx='14' fill='#0B0C0D'/>" +
      "<path d='M20 46V18h14a10 10 0 0 1 0 20H26' fill='none' stroke='#C9F24E' stroke-width='6' stroke-linecap='square'/>" +
      "<circle cx='45' cy='45' r='4' fill='#EDEBE6' fill-opacity='" + dotOpacity + "'/>" +
      "</svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function init() {
    if (U.reduced()) return; /* keep the static favicon.svg */

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    let on = true;
    link.href = frame("1");
    setInterval(() => {
      on = !on;
      link.href = frame(on ? "1" : "0.22");
    }, 1400);
  }

  return { init: init };
})();
