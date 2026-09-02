/* ============================================================
   CONFIG — everything editable lives here.
   Change name, email, links, projects, copy. Nothing else needed.
   ============================================================ */
window.PF = window.PF || {};

PF.CONFIG = {
  profile: {
    name: "PAUL",
    role: "CREATIVE WEB DEVELOPER",
    email: "diazpaul453@gmail.com",
    phone: "+63 993 414 9590",
    location: "Available worldwide — remote",
    status: "Available for projects",
    about: [
      "I build websites that don't just look good.",
      "I focus on creating digital experiences that are <strong>fast, interactive, and designed around real users</strong> — not around a template.",
      "I combine modern web technologies, thoughtful design, and creative interaction to help businesses stand out online.",
    ],
    facts: [
      { k: "Based", v: "Remote" },
      { k: "Focus", v: "Frontend + Interaction" },
      { k: "Stack", v: "Modern JavaScript" },
      { k: "Status", v: "Open" },
    ],
    socials: [
      { label: "GitHub", href: "https://github.com/RavenCasteal" },
      { label: "Instagram", href: "https://www.instagram.com/itsmrmilkshake/" },
    ],
  },

  /* ---------- projects: single source of truth for the work list + modal ---------- */
  projects: [
    {
      id: "miks-coffee",
      title: "Mik's Coffee Shop",
      category: "Coffee Shop Website",
      year: "2026",
      desc: "A warm, slow-brewed brand site for a neighbourhood coffee shop — menu, story and store locator built to feel as considered as the coffee.",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"],
      ui: ["Menu system", "Store locator", "Reservation form"],
      img: "assets/work/miks-coffee-1.jpg",
      shots: [
        "assets/work/miks-coffee-1.jpg",
        "assets/work/miks-coffee-2.png",
        "assets/work/miks-coffee-3.png",
        "assets/work/miks-coffee-4.png",
        "assets/work/miks-coffee-5.png",
        "assets/work/miks-coffee-6.png"
      ],
      live: "https://mik-s-coffee-shop.vercel.app/",
      overview:
        "Mik's is a small-batch coffee shop that needed an online home with the same warmth as the counter. The site leads with mood and product, then gets out of the way — a menu you can scan in three seconds and a location you can find in one.",
      problem:
        "The old presence was a social page and a PDF menu. Nothing was indexable, nothing worked on a phone, and regulars had no way to check seasonal offerings without messaging the shop directly.",
      solution:
        "I built a fast static site with a Firebase-backed menu and reservations flow, so the team can update offerings themselves. Every layout decision was made mobile-first, and the whole thing loads in well under a second on 4G.",
      features: [
        "Firebase-backed menu that the staff can edit without touching code",
        "Reservation request flow with confirmation states",
        "Store locator with opening hours and directions",
        "Mobile-first layouts tuned for one-handed use",
        "SEO-ready structure with local business markup",
      ],
    },
    {
      id: "milk-tea",
      title: "Russ Tea",
      category: "Interactive Business Website",
      year: "2026",
      desc: "An interactive site for a milk tea brand — product customiser, flavour finder and an ordering path built for thumbs.",
      tech: ["JavaScript", "CSS", "HTML", "Web Performance"],
      ui: ["Flavour finder", "Product customiser", "Order CTA"],
      img: "assets/work/russ-tea-1.png",
      shots: [
        "assets/work/russ-tea-1.png",
        "assets/work/russ-tea-2.png",
        "assets/work/russ-tea-3.png",
        "assets/work/russ-tea-4.png",
        "assets/work/russ-tea-5.png"
      ],
      live: "https://russ-tea-tan.vercel.app/",
      overview:
        "A growing milk tea brand with a menu long enough to intimidate. The site turns that menu into a guided experience: answer two questions, get a drink.",
      problem:
        "Twenty-plus drinks, six topping options and three sweetness levels meant new customers stalled at the menu and left. The existing page was a static list with no hierarchy.",
      solution:
        "I built a lightweight flavour finder and a visual customiser with instant feedback. The interactions are pure CSS transforms and vanilla JavaScript, so it stays smooth on mid-range phones — the majority of their traffic.",
      features: [
        "Flavour finder that narrows the menu to two taps",
        "Live product customiser with instant visual feedback",
        "Sticky order CTA that follows the scroll on mobile",
        "Performance budget met on throttled 4G",
        "Fully keyboard-operable interactive elements",
      ],
    },
    {
      id: "pearl-dental",
      title: "Pearl Dental",
      category: "Dental Clinic Landing Page",
      year: "2026",
      desc: "A calm, clinical landing page for a dental clinic — clear services, easy appointment booking, and a tone built to put anxious patients at ease.",
      tech: ["HTML", "CSS", "JavaScript", "UI/UX Design"],
      ui: ["Booking CTA", "Services grid", "Clinic info"],
      img: "assets/work/pearl-dental.svg",
      shots: ["assets/work/pearl-dental.svg", "assets/work/pearl-dental-mobile.svg"],
      live: "#",
      overview:
        "Pearl Dental is a neighbourhood clinic that wanted a web presence as reassuring as the waiting room. The landing page leads with trust signals and a single obvious next step: book a visit.",
      problem:
        "The clinic had no website — only a Google listing and a phone number. New patients couldn't learn about services or book without calling during office hours, and anxious first-timers had nothing to put them at ease beforehand.",
      solution:
        "I built a fast, mobile-first landing page with a prominent booking CTA, a plain-language services grid, and clinic information front and centre. The visual tone is clean and clinical, using generous space and a calm mint accent to lower anxiety rather than raise it.",
      features: [
        "Prominent booking CTA that stays one tap away on mobile",
        "Plain-language services grid with clear pricing cues",
        "Clinic info block: hours, location, and what to expect",
        "Calm, clinical visual system built to reduce patient anxiety",
        "Mobile-first layouts tuned for on-the-go booking",
      ],
    },
    {
      id: "portfolio-project",
      title: "Portfolio Project",
      category: "Creative Developer Portfolio",
      year: "2026",
      desc: "This site. A portfolio built as an interactive system rather than a scrolling gallery — every section reacts to the person using it.",
      tech: ["JavaScript", "CSS", "HTML", "Web Performance"],
      ui: ["Custom cursor", "Scroll engine", "Interactive lab"],
      img: "assets/work/portfolio-project.svg",
      shots: ["assets/work/portfolio-project.svg", "assets/work/portfolio-project-mobile.svg"],
      live: "#",
      overview:
        "A portfolio should demonstrate the thing it's selling. This one is a working interactive system: a custom scroll engine, a state-driven cursor, a draggable skills field and a live theme lab.",
      problem:
        "Most developer portfolios are the same layout with a different name — hero, three cards, a contact form. They communicate competence, not craft.",
      solution:
        "I built the site around a single accent, an editorial grid and a small set of reusable interaction primitives. Everything animates with transform and opacity only, respects prefers-reduced-motion, and degrades gracefully on touch devices.",
      features: [
        "Custom lerp scroll engine with a toggle in the lab",
        "State-driven custom cursor with contextual labels",
        "Draggable, hover-reactive skills field",
        "Live theme and typography controls",
        "No dependencies — vanilla JavaScript, ~0 build step",
      ],
    },
  ],

  /* ---------- services ---------- */
  services: [
    {
      n: "01",
      title: "Business Websites",
      desc: "Modern and professional websites designed to help businesses establish a strong online presence.",
    },
    {
      n: "02",
      title: "Interactive Web Experiences",
      desc: "Creative websites with smooth animations, interactions, and memorable user experiences.",
    },
    {
      n: "03",
      title: "Responsive Design",
      desc: "Websites optimized for desktop, tablet, and mobile devices built mobile-first.",
    },
    {
      n: "04",
      title: "Website Optimization",
      desc: "Improving website speed, SEO structure, accessibility, and overall user experience.",
    },
  ],

  /* ---------- process ---------- */
  steps: [
    { n: "01", title: "Discover", desc: "Understanding the business, audience, and goals before a single line of code." },
    { n: "02", title: "Design", desc: "Creating the structure, visual direction, and user experience." },
    { n: "03", title: "Develop", desc: "Building a fast, responsive, interactive website." },
    { n: "04", title: "Launch", desc: "Optimizing, testing, and deploying the final product." },
  ],

  /* ---------- skills: x/y are percentage positions inside the field ---------- */
  skills: [
    { name: "HTML", x: 8, y: 12, level: 5, desc: "Semantic, accessible markup as the foundation of every build.", projects: ["Mik's Coffee Shop"] },
    { name: "CSS", x: 40, y: 6, level: 5, desc: "Modern layout, custom properties, and motion that stays cheap to render.", projects: ["Portfolio Project", "Milk Tea Brand"] },
    { name: "JavaScript", x: 68, y: 15, level: 5, desc: "Vanilla-first interaction engineering — no framework needed to feel alive.", projects: ["Portfolio Project", "Milk Tea Brand"] },
    { name: "React", x: 12, y: 36, level: 4, desc: "Component architecture for products that need to grow.", projects: [] },
    { name: "Next.js", x: 46, y: 30, level: 4, desc: "Routing, rendering strategies and performance defaults for content-heavy sites.", projects: [] },
    { name: "Firebase", x: 74, y: 40, level: 4, desc: "Auth, data and hosting for sites clients can actually update.", projects: ["Mik's Coffee Shop"] },
    { name: "UI/UX Design", x: 6, y: 60, level: 4, desc: "Layout, hierarchy and interaction design before implementation.", projects: ["Milk Tea Brand"] },
    { name: "Responsive Design", x: 36, y: 56, level: 5, desc: "Mobile-first layouts that hold up on real, mid-range devices.", projects: ["Mik's Coffee Shop", "Milk Tea Brand"] },
    { name: "SEO", x: 66, y: 64, level: 4, desc: "Structure, semantics and metadata that make a site findable.", projects: ["Mik's Coffee Shop"] },
    { name: "Web Performance", x: 20, y: 82, level: 5, desc: "Budgets, lazy loading and transform-only animation to hold 60fps.", projects: ["Portfolio Project", "Milk Tea Brand"] },
  ],

  /* ---------- trust ---------- */
  trust: [
    "Modern design approach",
    "Mobile-first development",
    "Performance-focused websites",
    "SEO-ready structure",
    "Interactive experiences",
    "Clear communication",
  ],

  stats: [
    { value: 100, suffix: "%", label: "Responsive" },
    { value: 90, suffix: "+", label: "Performance target" },
    { value: null, suffix: "∞", label: "Creative possibilities" },
  ],
};
