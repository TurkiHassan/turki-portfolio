/* ==========================================================================
   Turki — portfolio behaviour
   - Arabic is the authored default; the English dictionary lives here.
   - Scroll drives the work panel: active project, dock icon, live screen.
   - Reveal system, split headings, language switch, Riyadh clock, hero rotator.
   ========================================================================== */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const PROJECTS = [
    { url: "https://www.iqudrah.com/", domain: "iqudrah.com" },
    { url: "https://alcjourney.com/", domain: "alcjourney.com" },
    { url: "https://pdfreader-alpha.vercel.app/", domain: "pdfreader-alpha.vercel.app" },
    { url: "https://ai-a2z.dev/", domain: "ai-a2z.dev" },
    {
      url: "https://turkihanan1-arch.github.io/python-academy-605/",
      domain: "python-academy-605",
    },
  ];

  const EN = {
    "landscape.replay": "Replay the signature",
    "ui.skip": "Skip to content",
    "ui.langTarget": "عربي",
    "ui.langAria": "Switch to Arabic",

    "brand.name": "Turki",

    "hero.kicker": "Five living works, and a longer road",
    "hero.title": "Building what Arabic <em>deserves</em>.",
    "hero.for": "For",
    "hero.lede":
      "Every tool here began as a question I could not answer in Arabic, so I wrote the answer myself. Five works run in the browser today; they are the first line of the story, not its last.",
    "hero.cta1": "Start with the work",
    "hero.cta2": "Philosophy",

    "mac.menu1": "File",
    "mac.menu2": "Edit",
    "mac.menu3": "View",
    "mac.menu4": "Window",
    "mac.menu5": "Help",
    "mac.live": "Two slots open",

    "dock.nav": "Turki's work",
    "social.nav": "My accounts",

    "proj.1.kicker": "Training · Web",
    "proj.1.title": "Qudrah, <em>a simulation like the exam room</em>",
    "proj.1.body":
      "An aptitude-test question bank that explains the mistake before it reveals the answer, then a full simulation with its timer and its pressure, so the exam room is never the first encounter.",
    "proj.1.cta": "Open Qudrah",
    "proj.1.nav": "Qudrah — go to the section",

    "proj.2.kicker": "Platform · Learning",
    "proj.2.title": "ALC Journey, <em>English as it is taught</em>",
    "proj.2.body":
      "The full ALC curriculum in the browser: thirty books, five thousand words with their sounds and examples, and flashcards that return every word to its lesson.",
    "proj.2.cta": "Open ALC Journey",
    "proj.2.nav": "ALC Journey — go to the section",

    "proj.3.kicker": "Tools · Web",
    "proj.3.title": "PDF Reader, <em>text set free from its file</em>",
    "proj.3.body":
      "It pulls text and tables out of Arabic and English PDFs and hands them back editable and ready to export, without leaving the browser.",
    "proj.3.cta": "Open PDF Reader",
    "proj.3.nav": "PDF Reader — go to the section",

    "proj.4.kicker": "Curriculum · AI",
    "proj.4.title": "AI Engineering, <em>genuinely from zero</em>",
    "proj.4.body":
      "503 lessons in sequence, starting at the first letter and ending with a model you train and test with your own hands, explained in Arabic with experiments that run inside the page.",
    "proj.4.cta": "Open the curriculum",
    "proj.4.nav": "AI Engineering — go to the section",

    "proj.5.kicker": "Curriculum · Python",
    "proj.5.title": "Python Academy, <em>code from the first line</em>",
    "proj.5.body":
      "Six units and 36 lessons in Programming for Data Science, taught in Arabic with 16 coding challenges corrected inside the browser.",
    "proj.5.cta": "Open Python Academy",
    "proj.5.nav": "Python Academy — go to the section",

    "p1.name": "Qudrah",
    "p2.name": "ALC Journey",
    "p3.name": "PDF Reader",
    "p4.name": "AI Engineering",
    "p5.name": "Python Academy",

    ribbon:
      "Arabic first<i></i>Method before interface<i></i>Learn to build<i></i>Build to teach<i></i>Ship it whole<i></i>From the first letter to the first model<i></i>",

    "vision.eyebrow": "The ambition",
    "vision.title": "Arabic is not waiting for someone to translate the future, <em>but for someone to build it in Arabic</em>.",
    "vision.body":
      "Every work here answered a single question. The ambition is for the answers to meet on one road, where an Arabic-speaking learner walks from the first letter to the first model they train by hand, with a method that respects their mind, their language and their time.",
    "vision.qlabel": "What guides me",
    "q1.t": "The limits of my language mean the limits of my world.",
    "q1.a": "Ludwig Wittgenstein",
    "q1.s": "Tractatus Logico-Philosophicus",
    "q2.t": "If one does not know to which port one is sailing, no wind is favourable.",
    "q2.a": "Seneca",
    "q2.s": "Letters to Lucilius",
    "q3.t": "Resolve comes in the measure of the resolute,<br>and noble deeds in the measure of the noble.",
    "q3.a": "Al-Mutanabbi",
    "q3.s": "From his ode to Sayf al-Dawla",

    "notes.eyebrow": "Notebook",
    "notes.title": "What I write <em>to remember</em>.",
    "notes.body": "Short lines from the workshop, the ones I return to whenever the road blurs.",
    "notes.n1.t": "Why I start with the method, not the interface",
    "notes.n1.b":
      "A beautiful interface makes a poor lesson easier to use, not better. I write the question and its explanation first; the screen comes only once I can teach it on paper.",
    "notes.n2.t": "Translation is not Arabisation",
    "notes.n2.b":
      '"Submit" is not "إرسال" in every context, and a "quiz" is not always an "اختبار". I rewrite the sentence as if it were born in Arabic, and keep the English term when it is the name.',
    "notes.n3.t": "Ship small, but ship whole",
    "notes.n3.b":
      "The first version does not need everything, but it needs a closed loop: the learner arrives, understands, errs, is corrected, and returns. Everything else can wait.",

    "footer.mark": "Turki · 2026",
  };

  const TITLES = {
    ar: "تركي — أبني للعربية ما تستحقه",
    en: "Turki — Building what Arabic deserves",
  };
  const DESCRIPTIONS = {
    ar: "خمسة منتجات عربية حيّة في المتصفح، وطموح أكبر: أن يجد كل متعلّم عربي أداته بلغته، من الصفر إلى الاحتراف.",
    en: "Five live Arabic products in the browser, and a bigger ambition: every Arabic-speaking learner finding their tool in their own language, from zero to mastery.",
  };

  const ROTATOR = {
    ar: ["المتعلّم الطموح", "المعلّم صاحب المنهج", "المطوّر العربي", "الجيل القادم"],
    en: ["the ambitious learner", "the teacher with a method", "the Arab developer", "the next generation"],
  };

  const html = document.documentElement;
  const reduceMotion = (() => {
    try {
      return matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  })();

  let lang = html.lang === "en" ? "en" : "ar";

  const arText = new Map();
  const arAria = new Map();

  $$("[data-i18n]").forEach((el) => arText.set(el.dataset.i18n, el.innerHTML));
  $$("[data-i18n-aria]").forEach((el) =>
    arAria.set(el.dataset.i18nAria, el.getAttribute("aria-label") || "")
  );

  /* --------------------------------------------------------------- language */

  function applyStrings() {
    $$("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const value = lang === "ar" ? arText.get(key) : EN[key];
      if (typeof value === "string") el.innerHTML = value;
    });
    $$("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      const value = lang === "ar" ? arAria.get(key) : EN[key];
      if (value) el.setAttribute("aria-label", value);
    });

    document.title = TITLES[lang];
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", DESCRIPTIONS[lang]);
    const ogTitle = $('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", TITLES[lang]);
    const ogDesc = $('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", DESCRIPTIONS[lang]);

    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }

  /* ---------------------------------------------------------- heading split */

  function splitHeadings() {
    if (reduceMotion) return;
    $$("h1[data-reveal], h2[data-reveal]").forEach((heading) => {
      if (heading.querySelector(".w")) {
        heading.dataset.split = "";
        return;
      }
      const frag = document.createDocumentFragment();
      let index = 0;

      const walk = (node, target) => {
        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                target.appendChild(document.createTextNode(part));
                return;
              }
              const word = document.createElement("span");
              word.className = "w";
              word.style.setProperty("--i", index++);
              const inner = document.createElement("span");
              inner.className = "wi";
              inner.textContent = part;
              word.appendChild(inner);
              target.appendChild(word);
            });
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const clone = child.cloneNode(false);
            target.appendChild(clone);
            walk(child, clone);
          }
        });
      };

      walk(heading, frag);
      heading.replaceChildren(frag);
      heading.dataset.split = "";
    });
  }

  /* --------------------------------------------------------------- reveal */

  let revealObserver = null;

  function initReveal() {
    const items = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
      );
    }
    items.forEach((el) => {
      if (!el.classList.contains("is-in")) revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------------- clock */

  function hhmm(timeZone) {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(new Date());
    } catch (e) {
      return "--:--";
    }
  }

  function tick() {
    const clock = $("#menuClock");
    if (!clock) return;
    const time = hhmm("Asia/Riyadh");
    if (clock.textContent !== time) clock.textContent = time;
  }

  /* ---------------------------------------------------------- work panel */

  const apps = $$(".app[data-project]");
  const screens = $$(".screen[data-screen]");
  const sections = $$(".project[data-project]");
  const tab = $("#screenTab");
  const tabDomain = $("#screenDomain");

  let current = -1;

  function updateTabAria(index) {
    if (!tab) return;
    const domain = PROJECTS[index].domain;
    tab.setAttribute(
      "aria-label",
      lang === "ar" ? `افتح ${domain} في تبويب جديد` : `Open ${domain} in a new tab`
    );
  }

  function setActive(next) {
    const index = Math.max(0, Math.min(PROJECTS.length - 1, Number(next) || 0));
    if (index === current) return;
    current = index;
    updateTabAria(index);
    const project = PROJECTS[index];

    apps.forEach((app) => {
      const on = Number(app.dataset.project) === index;
      app.classList.toggle("is-active", on);
      if (on) app.setAttribute("aria-current", "true");
      else app.removeAttribute("aria-current");
    });

    screens.forEach((screen) => {
      screen.classList.toggle("is-on", Number(screen.dataset.screen) === index);
    });

    sections.forEach((section) => {
      section.classList.toggle("is-current", Number(section.dataset.project) === index);
    });

    if (tab) {
      tab.href = project.url;
      tab.title = project.domain;
    }
    if (tabDomain) tabDomain.textContent = project.domain;
  }

  let ticking = false;
  let lockUntil = 0;

  function updateActive() {
    if (!sections.length) return;
    const mid = innerHeight * 0.5;
    let best = 0;
    let bestDistance = Infinity;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    setActive(best);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (performance.now() < lockUntil) return;
      updateActive();
    });
  }

  function initPanel() {
    apps.forEach((app) => {
      app.addEventListener("click", () => {
        setActive(Number(app.dataset.project));
        lockUntil = performance.now() + (reduceMotion ? 0 : 1800);
      });
    });

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("scrollend", updateActive);
    addEventListener("resize", onScroll, { passive: true });
    addEventListener("load", updateActive);
    addEventListener("wheel", () => (lockUntil = 0), { passive: true });
    addEventListener("touchstart", () => (lockUntil = 0), { passive: true });
    addEventListener("keydown", () => (lockUntil = 0));

    setActive(0);
    updateActive();
  }

  /* --------------------------------------------------------------- rotator */

  let rotIndex = 0;
  let rotTimer = null;

  function rotatorWord() {
    return $("#rotator .rotator-word");
  }

  function renderRotator() {
    const word = rotatorWord();
    if (word) word.textContent = ROTATOR[lang][rotIndex % ROTATOR[lang].length];
  }

  function stepRotator() {
    const word = rotatorWord();
    if (!word) return;
    word.classList.add("is-out");
    setTimeout(() => {
      rotIndex = (rotIndex + 1) % ROTATOR[lang].length;
      renderRotator();
      word.classList.remove("is-out");
      word.classList.add("is-in-start");
      void word.offsetWidth;
      word.classList.remove("is-in-start");
    }, 380);
  }

  function initRotator() {
    renderRotator();
    if (reduceMotion || rotTimer) return;
    rotTimer = setInterval(() => {
      if (!document.hidden) stepRotator();
    }, 2800);
  }

  /* ------------------------------------------------------------------ lang */

  function setLang(next, persist = true) {
    lang = next === "en" ? "en" : "ar";
    applyStrings();
    updateTabAria(current < 0 ? 0 : current);
    splitHeadings();
    renderRotator();
    tick();
    if (persist) {
      try {
        localStorage.setItem("lang", lang);
      } catch (e) {}
    }
    initReveal();
    window.__ready = true;
    html.classList.remove("lang-pending");
  }

  function toggleLang() {
    setLang(lang === "ar" ? "en" : "ar");
  }

  /* ------------------------------------------------------------------ init */

  setLang(lang, false);
  initPanel();
  initRotator();

  $("#langSwitch")?.addEventListener("click", toggleLang);
  $("#handle")?.addEventListener("click", toggleLang);

  tick();
  setInterval(tick, 1000);

  window.__ready = true;
  html.classList.remove("lang-pending");
})();
