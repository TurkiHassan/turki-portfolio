/* ==========================================================================
   Turki — portfolio behaviour
   - Arabic is the authored default; the English dictionary lives here.
   - Scroll drives the work panel: active project, dock icon, live screen.
   - Reveal system, split headings, language switch, Riyadh clock, mail links.
   ========================================================================== */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const EMAIL = "hello@example.com";

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
    "ui.skip": "Skip to content",
    "ui.langTarget": "عربي",
    "ui.langAria": "Switch to Arabic",

    "brand.name": "Turki",

    "hero.title": "Learning products, on the <em>edge</em>.",
    "hero.lede":
      "Five Arabic products that run in the browser: aptitude-test training, PDF reading, English learning, AI engineering, and Python. All of them here, on the edge of the screen.",
    "hero.cta1": "Start with the work",

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
      "A question bank for the aptitude test that explains the mistake before the right answer, then a full simulation with a timer and a score — the same order and the same pressure as the exam room.",
    "proj.1.p1": "A question bank with step-by-step explanations",
    "proj.1.p2": "A full timed simulation with a score",
    "proj.1.p3": "Works on a phone with nothing to install",
    "proj.1.cta": "Open Qudrah",
    "proj.1.nav": "Qudrah — go to the section",

    "proj.2.kicker": "Platform · Learning",
    "proj.2.title": "ALC Journey, <em>English as it is taught</em>",
    "proj.2.body":
      "The full ALC method in the browser: thirty books, five thousand words with pronunciation and examples, plus flashcards and tests that tie every word to its lesson.",
    "proj.2.p1": "30 books and 5,000 words with audio",
    "proj.2.p2": "Flashcards and a test for every lesson",
    "proj.2.p3": "A graded path through grammar and vocabulary",
    "proj.2.cta": "Open ALC Journey",
    "proj.2.nav": "ALC Journey — go to the section",

    "proj.3.kicker": "Tools · Web",
    "proj.3.title": "PDF Reader, <em>text out of the file</em>",
    "proj.3.body":
      "It pulls text and tables out of Arabic and English PDFs and returns them editable and ready to export — with no desktop software.",
    "proj.3.p1": "Arabic and English text extraction",
    "proj.3.p2": "Edit tables before you export",
    "proj.3.p3": "Everything happens in the browser",
    "proj.3.cta": "Open PDF Reader",
    "proj.3.nav": "PDF Reader — go to the section",

    "proj.4.kicker": "Curriculum · AI",
    "proj.4.title": "AI Engineering, <em>genuinely from zero</em>",
    "proj.4.body":
      "503 lessons in sequence, taking you from the basics to a model you train and test yourself, explained in Arabic with experiments that run inside the page.",
    "proj.4.p1": "503 lessons on a single path",
    "proj.4.p2": "Experiments and models in the browser",
    "proj.4.p3": "From the idea to the training run",
    "proj.4.cta": "Open the curriculum",
    "proj.4.nav": "AI Engineering — go to the section",

    "proj.5.kicker": "Curriculum · Python",
    "proj.5.title": "Python Academy, <em>code from the first line</em>",
    "proj.5.body":
      "Six units and 36 lessons in Programming for Data Science, taught in Arabic with 16 coding challenges corrected inside the browser.",
    "proj.5.p1": "36 lessons across six units",
    "proj.5.p2": "16 coding challenges with feedback",
    "proj.5.p3": "From the basics to data analysis",
    "proj.5.cta": "Open Python Academy",
    "proj.5.nav": "Python Academy — go to the section",

    "p1.name": "Qudrah",
    "p2.name": "ALC Journey",
    "p3.name": "PDF Reader",
    "p4.name": "AI Engineering",
    "p5.name": "Python Academy",

    "about.eyebrow": "About",
    "about.title": "I build what I looked for <em>and could not find</em>.",
    "about.body":
      "Each product started with a problem I or people around me ran into: a son preparing for the aptitude test, a friend translating a document, an old wish to learn English with a clear method. I could not find the Arabic tool I wanted, so I built it.",
    "about.b1.t": "Method first",
    "about.b1.d":
      "I start with the content, not the interface. I read the source, write the lesson, then build what makes it understood: practice, correction, simulation.",
    "about.b2.t": "Arabic first",
    "about.b2.d":
      "I do not translate an English interface. I write for Arabic: its direction, its terms, its examples.",
    "about.b3.t": "Browser first",
    "about.b3.d":
      "It works on a phone, with no download and as few accounts as possible. The idea arrives before the app gets heavy.",
    "about.tl.label": "What I have built",
    "about.tl1.t": "Qudrah",
    "about.tl1.d": "A question bank and a full mock",
    "about.tl2.t": "ALC Journey",
    "about.tl2.d": "Thirty books and flashcards",
    "about.tl3.t": "PDF Reader",
    "about.tl3.d": "Extract, edit and export",
    "about.tl4.t": "AI Engineering",
    "about.tl4.d": "503 sequential lessons",
    "about.tl5.t": "Python Academy",
    "about.tl5.d": "36 lessons and 16 challenges",

    "notes.eyebrow": "Notebook",
    "notes.title": "What I write <em>to remember</em>.",
    "notes.body":
      "Three short notes from building these products. Not essays, but the lines I come back to.",
    "notes.n1.t": "Why I start with the method, not the interface",
    "notes.n1.m": "3 min",
    "notes.n1.b":
      "A beautiful interface makes a bad lesson easier to use, not better. The first thing I write is the question and the explanation; the screen comes after I can teach it on paper.",
    "notes.n2.t": "Translation is not Arabisation",
    "notes.n2.m": "4 min",
    "notes.n2.b":
      '"Submit" is not "إرسال" in every context, and a "quiz" is not always an "اختبار". I rewrite the sentence as if it were written in Arabic first, and keep the English term when that is the term.',
    "notes.n3.t": "Ship small, but ship whole",
    "notes.n3.m": "2 min",
    "notes.n3.b":
      "The first version does not need every feature, but it needs the whole loop: a learner enters, understands, gets it wrong, is corrected, and comes back. The rest are features to postpone.",

    "footer.mark": "Turki · 2026",
    "footer.credit": "Background: Hikmet on Unsplash",
    "footer.email": "Email",
    "footer.emailAria": "Email — write to me",
  };

  const TITLES = {
    ar: "تركي — منتجات تعليمية عربية، على الطرف",
    en: "Turki — Arabic learning products, on the edge",
  };
  const DESCRIPTIONS = {
    ar: "خمسة منتجات عربية تعمل في المتصفح: تدريب على القدرات، قراءة PDF، تعلّم الإنجليزية، هندسة الذكاء الاصطناعي، وبايثون.",
    en: "Five Arabic products that run in the browser: aptitude-test training, PDF reading, English learning, AI engineering, and Python.",
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
  const tabNum = $("#screenNum");
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
    if (tabNum) tabNum.textContent = String(index + 1).padStart(2, "0");
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

  /* ------------------------------------------------------------- mail + lang */

  function initMail() {
    const href = `mailto:${EMAIL}`;
    $$("[data-mail]").forEach((el) => el.setAttribute("href", href));
  }

  function setLang(next, persist = true) {
    lang = next === "en" ? "en" : "ar";
    applyStrings();
    updateTabAria(current < 0 ? 0 : current);
    splitHeadings();
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

  initMail();
  setLang(lang, false);
  initPanel();

  $("#langSwitch")?.addEventListener("click", toggleLang);
  $("#handle")?.addEventListener("click", toggleLang);

  tick();
  setInterval(tick, 1000);

  window.__ready = true;
  html.classList.remove("lang-pending");
})();
