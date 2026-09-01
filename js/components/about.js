/* ============================================================
   ABOUT / SKILLS — a draggable, hover-reactive field of technologies
   instead of a list of progress bars.
   ============================================================ */
window.PF = window.PF || {};

PF.skills = (function () {
  const U = PF.utils;
  const C = PF.CONFIG;

  let field, panel;
  const nodes = [];

  function meter(level) {
    let out = '<div class="meter" aria-hidden="true">';
    for (let i = 0; i < 5; i++) out += '<i class="' + (i < level ? "on" : "") + '"></i>';
    return out + "</div>";
  }

  function render(skill) {
    panel.innerHTML =
      '<span class="mono mono--accent">Technology</span>' +
      '<h3 class="skills__name">' + U.escapeHTML(skill.name) + "</h3>" +
      '<p class="skills__desc">' + U.escapeHTML(skill.desc) + "</p>" +
      '<div class="skills__rows">' +
        '<div class="skills__row"><span>Experience</span><span>' +
          ["Exploring", "Working", "Daily use", "Confident", "Deep", "Deep"][skill.level] +
          "</span></div>" +
        '<div class="skills__row"><span>Confidence</span><span style="width:120px">' + meter(skill.level) + "</span></div>" +
        '<div class="skills__row"><span>Used in</span><span>' + skill.projects.join(", ") + "</span></div>" +
      "</div>";
  }

  function hint() {
    panel.innerHTML =
      '<span class="mono mono--accent">Stack</span>' +
      '<h3 class="skills__name">Ten tools,<br>one system.</h3>' +
      '<p class="skills__desc">Hover a technology — or drag it around. On touch, tap to inspect.</p>' +
      '<div class="skills__rows">' +
        '<div class="skills__row"><span>Total</span><span>' + C.skills.length + " technologies</span></div>" +
        '<div class="skills__row"><span>Primary</span><span>JavaScript / CSS</span></div>' +
        '<div class="skills__row"><span>Method</span><span>Vanilla first</span></div>' +
      "</div>";
  }

  function activate(skill) {
    nodes.forEach((n) => n.el.classList.toggle("is-active", n.skill === skill));
    render(skill);
  }

  function init() {
    field = U.qs(".skills__field");
    panel = U.qs(".skills__panel");
    if (!field || !panel) return;

    C.skills.forEach((skill) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "skill";
      el.setAttribute("data-cursor", "drag");
      el.setAttribute("data-cursor-label", "Drag");
      el.setAttribute("aria-label", skill.name + " — " + skill.desc);
      el.style.left = skill.x + "%";
      el.style.top = skill.y + "%";
      el.innerHTML = '<span class="skill__dot" aria-hidden="true"></span>' + U.escapeHTML(skill.name);
      field.appendChild(el);

      const node = { el: el, skill: skill, ox: 0, oy: 0 };
      nodes.push(node);

      el.addEventListener("pointerenter", () => activate(skill), { passive: true });
      el.addEventListener("focus", () => activate(skill));
      el.addEventListener("click", () => activate(skill));

      U.draggable(el, {
        getX: () => node.ox,
        getY: () => node.oy,
        set: (x, y) => {
          node.ox = x;
          node.oy = y;
          el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
        },
        bounds: () => {
          const f = field.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          return {
            minX: -r.left + f.left + 8,
            maxX: f.right - r.right - 8,
            minY: -r.top + f.top + 8,
            maxY: f.bottom - r.bottom - 8,
          };
        },
        onStart: () => activate(skill),
      });
    });

    hint();
  }

  return { init: init };
})();
