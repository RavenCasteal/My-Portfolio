/* ============================================================
   MAIN — renders content from CONFIG, then boots every module.
   ============================================================ */
(function () {
  const U = PF.utils;
  const C = PF.CONFIG;

  /* ---------- renderers ---------- */

  function setAll(sel, value) {
    if (value == null) return;
    U.qsa(sel).forEach((el) => {
      el.textContent = value;
      if (el.tagName === "A" && value.indexOf("@") > -1) {
        el.setAttribute("href", "mailto:" + value);
      }
    });
  }

  function profile() {
    setAll("[data-name]", C.profile.name);
    setAll("[data-role]", C.profile.role);
    setAll("[data-status]", C.profile.status);
    setAll("[data-year]", String(new Date().getFullYear()));
    setAll("[data-email]", C.profile.email);

    const socials = U.qs("[data-socials]");
    if (socials) {
      socials.innerHTML = C.profile.socials
        .map(
          (s) =>
            '<a class="contact__social" href="' + s.href + '" target="_blank" rel="noopener" data-magnetic>' +
            U.escapeHTML(s.label) +
            '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">' +
            '<path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>' +
            "</a>"
        )
        .join("");
    }
  }

  function about() {
    const copy = U.qs("[data-about-copy]");
    if (copy) copy.innerHTML = C.profile.about.map((p) => "<p>" + p + "</p>").join("");

    const facts = U.qs("[data-about-facts]");
    if (facts) {
      facts.innerHTML = C.profile.facts
        .map((f) => "<div class=\"about__fact\"><dt>" + U.escapeHTML(f.k) + "</dt><dd>" + U.escapeHTML(f.v) + "</dd></div>")
        .join("");
    }
  }

  function services() {
    const el = U.qs("[data-services]");
    if (!el) return;
    el.innerHTML = C.services
      .map(
        (s) =>
          '<article class="service fade" data-anim data-cursor="link">' +
            '<span class="service__num">' + s.n + "</span>" +
            '<h3 class="service__title">' + U.escapeHTML(s.title) + "</h3>" +
            '<p class="service__desc">' + U.escapeHTML(s.desc) + "</p>" +
            '<span class="service__more">Learn more ' +
              '<svg width="14" height="9" viewBox="0 0 16 10" fill="none" aria-hidden="true">' +
              '<path d="M11 1l4 4-4 4M15 5H0" stroke="currentColor" stroke-width="1.2"/></svg>' +
            "</span>" +
          "</article>"
      )
      .join("");
  }

  function steps() {
    const el = U.qs("[data-steps]");
    if (!el) return;
    el.innerHTML = C.steps
      .map(
        (s) =>
          '<article class="step">' +
            '<span class="step__num">' + s.n + "</span>" +
            '<h3 class="step__title">' + U.escapeHTML(s.title) + "</h3>" +
            '<p class="step__desc">' + U.escapeHTML(s.desc) + "</p>" +
          "</article>"
      )
      .join("");
  }

  function trust() {
    const list = U.qs("[data-trust]");
    if (list) {
      list.innerHTML = C.trust
        .map((t) => '<li class="trust__item">' + U.escapeHTML(t) + "</li>")
        .join("");
    }

    const stats = U.qs("[data-stats]");
    if (stats) {
      stats.innerHTML = C.stats
        .map((s, i) => {
          const value = s.value == null
            ? s.suffix
            : '<span data-count="' + s.value + '">0</span>' + s.suffix;
          return (
            '<div class="stat fade' + (i === 1 ? " stat--accent" : "") + '" data-anim>' +
              '<div class="stat__value">' + value + "</div>" +
              '<div class="stat__label">' + U.escapeHTML(s.label) + "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  function ticker() {
    const track = U.qs("[data-ticker]");
    if (!track) return;
    const words = C.skills.map((s) => s.name).concat([
      "Interaction design", "Performance", "Accessibility", "Motion",
    ]);
    const run = words.map((w) => "<span>" + U.escapeHTML(w) + "</span>").join("");
    track.innerHTML = run + run; /* duplicated for a seamless -50% loop */
  }

  /* ---------- misc chrome ---------- */

  function backToTop() {
    const btn = U.qs("[data-top]");
    if (!btn) return;
    btn.addEventListener("click", () => PF.smooth.scrollTo(0));
  }

  function render() {
    profile();
    about();
    services();
    steps();
    trust();
    ticker();
  }

  function boot() {
    render();

    PF.smooth.init();
    PF.cursor.init();
    PF.nav.init();
    PF.dots.init();
    PF.favicon.init();
    PF.hero.init();
    PF.work.init();
    PF.skills.init();
    PF.playground.init();
    PF.magnetic.init();
    PF.services.init();
    backToTop();

    PF.smooth.refresh();

    /* reveal animations start once the loader is out of the way */
    PF.loader.init(function () {
      document.documentElement.classList.add("is-ready");
      PF.scrollAnim.init();
      PF.smooth.refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
