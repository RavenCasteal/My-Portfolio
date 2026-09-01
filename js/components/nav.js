/* ============================================================
   NAV — sticky state, full-screen mobile overlay, anchor routing
   using native smooth scrolling.
   ============================================================ */
window.PF = window.PF || {};

PF.nav = (function () {
  const U = PF.utils;
  let menu, burger, lastFocus = null;

  function openMenu() {
    menu.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("is-locked");
    lastFocus = document.activeElement;
    const first = menu.querySelector(".menu__link");
    if (first) setTimeout(() => first.focus(), 380);
  }

  function closeMenu() {
    if (!menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    if (!document.querySelector(".modal.is-open")) {
      document.documentElement.classList.remove("is-locked");
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function init() {
    menu = U.qs(".menu");
    burger = U.qs(".nav__burger");
    if (!menu || !burger) return;

    burger.addEventListener("click", () => {
      if (menu.classList.contains("is-open")) closeMenu();
      else openMenu();
    });

    menu.addEventListener("click", (e) => {
      const link = e.target.closest(".menu__link");
      if (link) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    /* keep focus inside the overlay while it's open */
    menu.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !menu.classList.contains("is-open")) return;
      const focusables = U.qsa("a, button", menu).filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    });

    /* anchor navigation — native smooth scroll */
    U.qsa('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 60;
        PF.smooth.scrollTo(top);
        history.replaceState(null, "", id);
      });
    });
  }

  return { init: init, close: closeMenu };
})();
