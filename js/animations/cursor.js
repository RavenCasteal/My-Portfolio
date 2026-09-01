/* ============================================================
   CUSTOM CURSOR — dot + ring, state driven by data-cursor attributes.
   Desktop / fine pointers only. Never touches layout.
   ============================================================ */
window.PF = window.PF || {};

PF.cursor = (function () {
  const U = PF.utils;
  let root;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;
  let scale = 1;
  let scaleTarget = 1;
  let active = false;

  function build() {
    root = document.createElement("div");
    root.className = "cursor";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML =
      '<div class="cursor__ring"><span class="cursor__label">VIEW PROJECT</span></div>' +
      '<div class="cursor__dot"></div>';
    document.body.appendChild(root);
    document.documentElement.classList.add("has-custom-cursor");
  }

  function setState(state) {
    if (!root) return;
    if (state) root.setAttribute("data-state", state);
    else root.removeAttribute("data-state");
  }

  function loop() {
    if (!active) return;
    const p = U.pointer;
    x = p.x;
    y = p.y;
    rx = U.lerp(rx, x, 0.18);
    ry = U.lerp(ry, y, 0.18);
    scale = U.lerp(scale, scaleTarget, 0.2);
    root.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    const ring = root.firstElementChild;
    ring.style.transform =
      "translate3d(" + (rx - x) + "px," + (ry - y) + "px,0) scale(" + scale.toFixed(3) + ")";
    requestAnimationFrame(loop);
  }

  /* elements carrying data-cursor set the state on hover */
  function bind() {
    document.addEventListener(
      "pointerover",
      (e) => {
        const hit = e.target.closest && e.target.closest("[data-cursor]");
        if (!hit) return;
        setState(hit.getAttribute("data-cursor"));
        const label = hit.getAttribute("data-cursor-label");
        if (label) root.querySelector(".cursor__label").textContent = label;
      },
      { passive: true }
    );

    document.addEventListener(
      "pointerout",
      (e) => {
        const hit = e.target.closest && e.target.closest("[data-cursor]");
        if (!hit) return;
        if (e.relatedTarget && hit.contains(e.relatedTarget)) return;
        setState(null);
      },
      { passive: true }
    );

    window.addEventListener("pointerdown", () => { scaleTarget = 0.82; root.setAttribute("data-press", "true"); }, { passive: true });
    window.addEventListener("pointerup", () => { scaleTarget = 1; root.removeAttribute("data-press"); }, { passive: true });
    document.addEventListener("mouseleave", () => { root.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { root.style.opacity = "1"; });
  }

  function init() {
    if (U.reduced() || !U.finePointer()) return;
    build();
    bind();
    active = true;
    requestAnimationFrame(loop);
  }

  return { init: init, setState: setState, refresh: bind };
})();
