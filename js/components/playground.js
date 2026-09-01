/* ============================================================
   PLAYGROUND — a small lab where the visitor takes control:
   accent colour, grid density, grain, type scale, scroll feel,
   and three draggable UI components.
   ============================================================ */
window.PF = window.PF || {};

PF.playground = (function () {
  const U = PF.utils;

  const NODES = [
    { id: "btn", x: 8, y: 12, title: "Button", body: "Start a project" },
    { id: "card", x: 52, y: 40, title: "Card", body: "Selected work 01" },
    { id: "tag", x: 20, y: 68, title: "Tag", body: "Interactive" },
  ];

  let canvas;
  const nodeResets = [];

  function mountNodes() {
    canvas = U.qs(".lab__canvas");
    if (!canvas) return;
    NODES.forEach((n) => {
      const el = document.createElement("div");
      el.className = "lab__node";
      el.setAttribute("data-cursor", "drag");
      el.setAttribute("data-cursor-label", "Drag me");
      el.style.left = n.x + "%";
      el.style.top = n.y + "%";
      el.innerHTML =
        "<b>" + n.title + "</b>" + n.body + "<i></i><i></i>";
      canvas.appendChild(el);

      let ox = 0;
      let oy = 0;
      nodeResets.push(() => {
        ox = 0;
        oy = 0;
        el.style.transform = "";
      });
      U.draggable(el, {
        getX: () => ox,
        getY: () => oy,
        set: (x, y) => {
          ox = x;
          oy = y;
          el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
        },
        bounds: () => {
          const f = canvas.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          return {
            minX: -r.left + f.left + 10,
            maxX: f.right - r.right - 10,
            minY: -r.top + f.top + 10,
            maxY: f.bottom - r.bottom - 10,
          };
        },
      });
    });
  }

  function swatches() {
    U.qsa("[data-accent-set]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.documentElement.setAttribute("data-accent", btn.getAttribute("data-accent-set"));
        U.qsa("[data-accent-set]").forEach((b) =>
          b.setAttribute("aria-pressed", String(b === btn))
        );
      });
    });
  }

  function toggles() {
    U.qsa("[data-toggle]").forEach((btn) => {
      const key = btn.getAttribute("data-toggle");
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", String(next));
        apply(key, next);
      });
    });
  }

  function apply(key, on) {
    const root = document.documentElement;
    if (key === "grid") document.body.setAttribute("data-grid", on ? "on" : "off");
    if (key === "dense") document.body.setAttribute("data-grid", on ? "hi" : "on");
    if (key === "grain") root.style.setProperty("--grain", on ? "0.05" : "0");
  }

  function slider() {
    const input = U.qs("[data-scale]");
    const out = U.qs("[data-scale-out]");
    if (!input) return;
    input.addEventListener("input", () => {
      const v = parseFloat(input.value);
      document.documentElement.style.setProperty("--scale", v.toFixed(2));
      if (out) out.textContent = Math.round(v * 100) + "%";
    });
  }

  function reset() {
    const btn = U.qs("[data-reset]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      document.documentElement.setAttribute("data-accent", "lime");
      document.documentElement.style.setProperty("--scale", "1");
      document.documentElement.style.setProperty("--grain", "0.035");
      document.body.setAttribute("data-grid", "on");
      U.qsa("[data-accent-set]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.getAttribute("data-accent-set") === "lime"))
      );
      U.qsa("[data-toggle]").forEach((b) => {
        const key = b.getAttribute("data-toggle");
        const on = { grid: true, dense: false, grain: true }[key] !== false;
        b.setAttribute("aria-pressed", String(on));
        apply(key, on);
      });
      const input = U.qs("[data-scale]");
      if (input) {
        input.value = "1";
        const out = U.qs("[data-scale-out]");
        if (out) out.textContent = "100%";
      }
      nodeResets.forEach((fn) => fn());
    });
  }

  function init() {
    mountNodes();
    swatches();
    toggles();
    slider();
    reset();
  }

  return { init: init };
})();
