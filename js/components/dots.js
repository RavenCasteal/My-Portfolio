/* ============================================================
   DOTS — fixed side navigation that tracks the active section
   and lets you jump to it. Pure transform/opacity, rAF-throttled.
   ============================================================ */
window.PF = window.PF || {};

PF.dots = (function () {
  const U = PF.utils;

  const SECTIONS = [
    { id: "top", label: "Top" },
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "process", label: "Process" },
    { id: "lab", label: "Lab" },
    { id: "contact", label: "Contact" },
  ];

  let nav, dots = [];

  function go(target) {
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(target);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: top, behavior: "smooth" });
    }
  }

  function setActive(id) {
    dots.forEach((d) => {
      const on = d.getAttribute("data-target") === id;
      d.classList.toggle("is-active", on);
      if (on) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  }

  function update() {
    const y = window.scrollY || window.pageYOffset;
    const line = y + window.innerHeight * 0.4;
    let current = "top";
    for (let i = 0; i < SECTIONS.length; i++) {
      const s = SECTIONS[i];
      if (s.id === "top") continue;
      const el = document.getElementById(s.id);
      if (!el) continue;
      const topAbs = el.getBoundingClientRect().top + y;
      if (topAbs - 60 <= line) current = s.id;
    }
    setActive(current);
  }

  function init() {
    nav = document.createElement("nav");
    nav.className = "dots";
    nav.setAttribute("aria-label", "Section navigation");

    SECTIONS.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dots__dot";
      btn.setAttribute("data-target", s.id);
      btn.setAttribute("data-cursor", "link");
      btn.setAttribute("aria-label", "Go to " + s.label);
      btn.innerHTML =
        '<span class="dots__label">' + s.label + "</span>" +
        '<span class="dots__pip" aria-hidden="true"></span>';
      btn.addEventListener("click", () => go(s.id));
      nav.appendChild(btn);
      dots.push(btn);
    });

    document.body.appendChild(nav);

    U.onScroll(update);
    update();
  }

  return { init: init };
})();
