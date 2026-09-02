/* ============================================================
   WORK — editorial project rows + animated detail modal.
   Content comes from PF.CONFIG.projects (single source of truth).
   ============================================================ */
window.PF = window.PF || {};

PF.work = (function () {
  const U = PF.utils;
  const C = PF.CONFIG;
  let list, modal, panel, lastFocus = null;
  let currentIndex = -1;

  const ARROW =
    '<svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">' +
    '<path d="M11 1l4 4-4 4M15 5H0" stroke="currentColor" stroke-width="1.2"/></svg>';

  function chip(text, accent) {
    return '<span class="chip' + (accent ? " chip--accent" : "") + '">' + U.escapeHTML(text) + "</span>";
  }

  function rowHTML(p, i) {
    const total = String(C.projects.length).padStart(2, "0");
    const n = String(i + 1).padStart(2, "0");
    return (
      '<article class="work__row reveal" data-anim data-project="' + p.id + '">' +
        '<div class="work__index"><b>' + n + "</b> / " + total + "</div>" +
        '<figure class="work__media" data-parallax="0.035">' +
          '<img class="work__img" src="' + p.img + '" alt="' + U.escapeHTML(p.title) +
            ' website preview" loading="lazy" decoding="async" width="1200" height="900">' +
          '<span class="work__corner" aria-hidden="true"></span>' +
          '<div class="work__overlay">' + p.ui.map((t) => chip(t)).join("") + "</div>" +
        "</figure>" +
        '<div class="work__body">' +
          '<div class="work__meta">' + chip(p.category, true) +
            '<span class="mono">' + U.escapeHTML(p.year) + "</span></div>" +
          '<h3 class="work__title">' +
            '<a class="work__link" href="#work/' + p.id + '" data-cursor="view" data-cursor-label="View project">' +
              U.escapeHTML(p.title) +
            "</a>" +
          "</h3>" +
          '<p class="work__desc">' + U.escapeHTML(p.desc) + "</p>" +
          '<div class="work__tags">' + p.tech.map((t) => chip(t)).join("") + "</div>" +
          '<span class="work__open">Open case study ' + ARROW + "</span>" +
        "</div>" +
      "</article>"
    );
  }

  function detailHTML(p) {
    const next = C.projects[(C.projects.indexOf(p) + 1) % C.projects.length];
    return (
      '<div class="modal__bar">' +
        '<span class="mono">Case study — ' + U.escapeHTML(p.category) + " / " + U.escapeHTML(p.year) + "</span>" +
        '<button class="modal__close" type="button" data-close>Close ' +
          '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor"/></svg>' +
        "</button>" +
      "</div>" +
      '<div class="modal__hero"><img src="' + p.img + '" alt="' + U.escapeHTML(p.title) +
        ' full website preview" loading="lazy" decoding="async" width="1200" height="900"></div>' +
      '<div class="modal__body">' +
        '<div><span class="mono mono--accent">' + U.escapeHTML(p.category) + "</span>" +
          '<h2 class="modal__title" style="margin-top:14px">' + U.escapeHTML(p.title) + "</h2></div>" +
        '<div class="modal__grid">' +
          '<div class="modal__block"><h3>Overview</h3><p>' + U.escapeHTML(p.overview) + "</p></div>" +
          '<div class="modal__block"><h3>Technologies</h3><div class="work__tags" style="margin-top:0">' +
            p.tech.map((t) => chip(t)).join("") + "</div>" +
            '<h3 style="margin-top:32px">Live</h3>' +
            '<a class="btn" href="' + p.live + '" target="_blank" rel="noopener" data-magnetic>Visit website ' + ARROW + "</a>" +
          "</div>" +
        "</div>" +
        '<div class="modal__grid">' +
          '<div class="modal__block"><h3>The problem</h3><p>' + U.escapeHTML(p.problem) + "</p></div>" +
          '<div class="modal__block"><h3>The solution</h3><p>' + U.escapeHTML(p.solution) + "</p></div>" +
        "</div>" +
        '<div class="modal__block"><h3>Features</h3><ul class="modal__features">' +
          p.features.map((f) => "<li><span></span><span>" + U.escapeHTML(f) + "</span></li>").join("") +
        "</ul></div>" +
        '<div class="modal__block"><h3>Screenshots</h3><div class="modal__shots">' +
          p.shots.map((s, i) =>
            '<figure><img src="' + s + '" alt="' + U.escapeHTML(p.title) + " screenshot " + (i + 1) +
            '" loading="lazy" decoding="async"></figure>').join("") +
        "</div></div>" +
        '<button class="modal__next" type="button" data-next="' + next.id + '" data-cursor="link">' +
          "<span><span class=\"mono\">Next project</span>" +
          "<strong>" + U.escapeHTML(next.title) + "</strong></span>" +
          '<span class="btn__arrow">' + ARROW + "</span>" +
        "</button>" +
      "</div>"
    );
  }

  function open(id) {
    const index = C.projects.findIndex((p) => p.id === id);
    if (index < 0 || !modal) return;
    currentIndex = index;
    const p = C.projects[index];
    panel.innerHTML = detailHTML(p);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("is-locked");
    lastFocus = document.activeElement;
    panel.scrollTop = 0;
    const closeBtn = panel.querySelector("[data-close]");
    if (closeBtn) setTimeout(() => closeBtn.focus(), 120);
    if (history.pushState) history.pushState({ project: id }, "", "#work/" + id);
    PF.magnetic.register(closeBtn);
    PF.magnetic.register(U.qs(".btn", panel));
  }

  function close() {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".menu.is-open")) {
      document.documentElement.classList.remove("is-locked");
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    currentIndex = -1;
    if (history.pushState) history.pushState({}, "", location.pathname + location.search);
  }

  function init() {
    list = U.qs(".work");
    modal = U.qs(".modal");
    if (!list) return;

    list.innerHTML = C.projects.map(rowHTML).join("");

    /* whole row is clickable via the heading link */
    list.addEventListener("click", (e) => {
      const link = e.target.closest(".work__link");
      if (!link) return;
      e.preventDefault();
      open(link.getAttribute("href").split("/")[1]);
    });

    if (modal) {
      panel = U.qs(".modal__panel", modal);
      modal.addEventListener("click", (e) => {
        if (e.target.hasAttribute("data-close") || e.target.closest("[data-close]")) return close();
        if (e.target.classList.contains("modal__scrim")) return close();
        const next = e.target.closest("[data-next]");
        if (next) {
          open(next.getAttribute("data-next"));
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
        if (e.key === "Tab" && modal.classList.contains("is-open")) {
          const f = U.qsa("a[href], button", panel).filter((el) => el.offsetParent !== null);
          if (!f.length) return;
          const first = f[0];
          const last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }

    /* deep link support: /#work/miks-coffee */
    const hash = location.hash.match(/^#work\/(.+)$/);
    if (hash) setTimeout(() => open(hash[1]), 2200);

    window.addEventListener("popstate", () => {
      const h = location.hash.match(/^#work\/(.+)$/);
      if (h) open(h[1]);
      else close();
    });
  }

  return { init: init, open: open, close: close };
})();
