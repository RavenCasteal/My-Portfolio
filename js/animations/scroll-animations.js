/* ============================================================
   SCROLL ANIMATIONS — reveals, parallax, progress, nav state,
   process activation, counters. One rAF-throttled scroll listener.
   ============================================================ */
window.PF = window.PF || {};

PF.scrollAnim = (function () {
  const U = PF.utils;
  const parallaxItems = [];
  const stepItems = [];
  let progressBar = null;
  let nav = null;
  let lastY = 0;

  /* ---------- reveals ---------- */
  function reveals() {
    const targets = U.qsa("[data-anim]");
    if (!targets.length) return;
    if (U.reduced()) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    U.observe(targets, (el) => el.classList.add("is-in"));
  }

  /* ---------- parallax: only for elements currently on screen ---------- */
  function parallax() {
    if (U.reduced()) return;
    U.qsa("[data-parallax]").forEach((el) => {
      const item = { el: el, speed: parseFloat(el.getAttribute("data-parallax")) || 0.08, visible: false, offset: 0 };
      parallaxItems.push(item);
      U.track(
        [el],
        () => { item.visible = true; U.requestFrame(); },
        () => { item.visible = false; }
      );
    });
  }

  function updateParallax(y) {
    const vh = window.innerHeight;
    for (let i = 0; i < parallaxItems.length; i++) {
      const it = parallaxItems[i];
      if (!it.visible) continue;
      const r = it.el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const delta = (center - vh / 2) * it.speed;
      it.el.style.transform = "translate3d(0," + delta.toFixed(2) + "px,0)";
    }
  }

  /* ---------- progress bar ---------- */
  function progress(y) {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? U.clamp(y / max, 0, 1) : 0;
    progressBar.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  /* ---------- sticky nav behaviour ---------- */
  function navState(y) {
    if (!nav) return;
    if (y > 40) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");

    const goingDown = y > lastY;
    const menuOpen = document.querySelector(".menu.is-open");
    if (!menuOpen && goingDown && y > 420) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");

    lastY = y;
  }

  /* ---------- process steps: highlight the one nearest mid-viewport ---------- */
  function steps() {
    const els = U.qsa(".step");
    if (!els.length) return;
    els.forEach((el) => stepItems.push({ el: el, top: 0, height: 0 }));
    measureSteps();
    window.addEventListener("resize", measureSteps, { passive: true });
    U.onScroll(updateSteps);
    updateSteps(window.scrollY);
  }

  function measureSteps() {
    stepItems.forEach((s) => {
      const r = s.el.getBoundingClientRect();
      s.top = r.top + window.scrollY;
      s.height = r.height;
    });
  }

  function updateSteps(y) {
    if (U.reduced()) {
      stepItems.forEach((s) => s.el.classList.add("is-active"));
      return;
    }
    const line = y + window.innerHeight * 0.62;
    let best = -1;
    let bestDist = Infinity;
    for (let i = 0; i < stepItems.length; i++) {
      const s = stepItems[i];
      const center = s.top + s.height / 2;
      const d = Math.abs(center - line);
      if (line >= s.top - 40 && d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    stepItems.forEach((s, i) => {
      s.el.classList.toggle("is-active", i <= best);
    });
  }

  /* ---------- animated counters ---------- */
  function counters() {
    U.qsa("[data-count]").forEach((el) => {
      const end = parseFloat(el.getAttribute("data-count"));
      const dur = 1400;
      let started = false;
      U.observe([el], () => {
        if (started) return;
        started = true;
        if (U.reduced()) {
          el.textContent = String(end);
          return;
        }
        const t0 = performance.now();
        (function tick(now) {
          const p = U.clamp((now - t0) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(end * eased));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    });
  }

  /* ---------- active nav link ---------- */
  function activeLink() {
    const links = U.qsa(".nav__link");
    const sections = links
      .map((l) => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);
    if (!sections.length) return;
    U.track(sections, (section) => {
      links.forEach((l) => {
        const on = l.getAttribute("href") === "#" + section.id;
        if (on) l.setAttribute("aria-current", "true");
        else l.removeAttribute("aria-current");
      });
    });
  }

  function init() {
    progressBar = U.qs(".progress__bar");
    nav = U.qs(".nav");
    reveals();
    parallax();
    steps();
    counters();
    activeLink();

    U.onScroll(progress);
    U.onScroll(navState);
    U.onScroll(updateParallax);
    U.requestFrame();
  }

  return { init: init, refresh: measureSteps };
})();
