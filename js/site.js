(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function applySettings() {
    const settings = JSON.parse(localStorage.getItem("siteSettings") || "{}");

    if (document.body.classList.contains("home-classic")) {
      return;
    }

    if (settings.primary) {
      document.documentElement.style.setProperty("--sun", settings.primary);
    }

    if (settings.font) {
      document.body.style.fontFamily = settings.font + ", Arial, sans-serif";
    }

    const heroTitle = qs(".hero .hero-copy h1");
    const heroDesc = qs(".hero .hero-copy p:not(.eyebrow)");

    if (heroTitle && settings.heroTitle) {
      heroTitle.textContent = settings.heroTitle;
    }

    if (heroDesc && settings.heroDesc) {
      heroDesc.textContent = settings.heroDesc;
    }
  }

  function setupMenu() {
    const button = qs(".menu-button");
    const menu = qs("#site-menu");
    if (!button || !menu) return;

    button.addEventListener("click", function () {
      const isOpen = menu.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
    });

    menu.addEventListener("click", function (event) {
      if (event.target.tagName !== "A") return;
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
    });
  }

  function normalizePath(pathname) {
    const last = pathname.split("/").pop() || "index.html";
    return last === "" ? "index.html" : last;
  }

  function setupActiveNavigation() {
    const currentPage = normalizePath(window.location.pathname);
    const currentHash = window.location.hash;
    const links = document.querySelectorAll(".site-nav a, .system-quickbar a");

    links.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("http")) return;

      const url = new URL(href, window.location.href);
      const targetPage = normalizePath(url.pathname);
      const targetHash = url.hash;
      let isCurrent = false;

      if (targetPage === currentPage) {
        if (targetHash) {
          isCurrent = targetHash === currentHash;
        } else {
          isCurrent = !currentHash;
        }
      }

      if (currentPage === "index.html" && href === "#inicio") {
        isCurrent = !currentHash || currentHash === "#inicio";
      }

      if (currentPage === "sistemas.html" && !currentHash && href.includes("sistemas.html")) {
        isCurrent = href.includes("#leveis") || href === "sistemas.html";
      }

      link.classList.toggle("is-current", isCurrent);
      link.classList.toggle("active", isCurrent);
    });
  }

  function setupFolkloreTrickster() {
    if (document.querySelector(".trickster-widget")) return;

    const widget = document.createElement("aside");
    widget.className = "trickster-widget";
    widget.setAttribute("aria-label", "Travessuras do Saci");
    widget.innerHTML = `
      <button class="trickster-avatar" type="button" aria-expanded="false" aria-controls="trickster-panel">
        <img src="imagens/saci-perere.svg" alt="Saci Pererê">
      </button>
      <div class="wind-burst" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="trickster-panel" id="trickster-panel" hidden>
        <strong>Saci apareceu</strong>
        <p>Ele pode bagunçar a página por alguns segundos.</p>
        <button type="button" data-trick="shake">Tremer</button>
        <button type="button" data-trick="hide">Esconder algo</button>
        <button type="button" data-trick="shuffle">Embaralhar cards</button>
        <button type="button" data-trick="dash">Passar correndo</button>
        <button type="button" data-trick="restore">Restaurar</button>
      </div>
      <p class="trickster-speech" aria-live="polite"></p>
    `;

    document.body.appendChild(widget);

    const avatar = widget.querySelector(".trickster-avatar");
    const panel = widget.querySelector(".trickster-panel");
    const speech = widget.querySelector(".trickster-speech");
    const wind = widget.querySelector(".wind-burst");
    const messages = [
      "Sumiu? Foi vento.",
      "Assobio curto, caos pequeno.",
      "A mata mexeu na página.",
      "Só uma travessura."
    ];

    function speak(text) {
      speech.textContent = text || messages[Math.floor(Math.random() * messages.length)];
      speech.classList.add("show");
      window.clearTimeout(speech._timer);
      speech._timer = window.setTimeout(function () {
        speech.classList.remove("show");
      }, 2600);
    }

    function makeAudioContext() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      if (!window.EraXAudioContext) window.EraXAudioContext = new AudioContext();
      if (window.EraXAudioContext.state === "suspended") window.EraXAudioContext.resume();
      return window.EraXAudioContext;
    }

    function playWhistle() {
      const ctx = makeAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const gain = ctx.createGain();
      const osc = ctx.createOscillator();
      const tremolo = ctx.createOscillator();
      const tremoloGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(1550, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.45);

      tremolo.type = "sine";
      tremolo.frequency.setValueAtTime(13, now);
      tremoloGain.gain.setValueAtTime(0.055, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

      tremolo.connect(tremoloGain);
      tremoloGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      tremolo.start(now);
      osc.stop(now + 0.55);
      tremolo.stop(now + 0.55);
    }

    function playWind() {
      const ctx = makeAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const duration = 0.55;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i += 1) {
        const fade = 1 - i / bufferSize;
        data[i] = (Math.random() * 2 - 1) * fade * 0.25;
      }

      const noise = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      noise.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(520, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + duration);
      filter.Q.setValueAtTime(0.7, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + duration);
    }

    function burstWind() {
      wind.classList.remove("active");
      window.requestAnimationFrame(function () {
        wind.classList.add("active");
      });
      window.setTimeout(function () {
        wind.classList.remove("active");
      }, 720);
      playWind();
    }

    function restore() {
      document.body.classList.remove("screen-shake");
      document.querySelectorAll(".trick-hidden").forEach(function (element) {
        element.classList.remove("trick-hidden");
      });
      document.querySelectorAll(".saci-dash-target").forEach(function (element) {
        element.classList.remove("saci-dash-target");
      });
      document.querySelectorAll("[data-original-order]").forEach(function (container) {
        Array.from(container.children)
          .sort(function (a, b) {
            return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
          })
          .forEach(function (child) {
            container.appendChild(child);
          });
      });
      speak("Pronto, devolvi.");
    }

    function shake() {
      burstWind();
      document.body.classList.remove("screen-shake");
      window.requestAnimationFrame(function () {
        document.body.classList.add("screen-shake");
      });
      window.setTimeout(function () {
        document.body.classList.remove("screen-shake");
      }, 650);
      speak("O chão lembrou do Saci.");
    }

    function hideSomething() {
      burstWind();
      restore();
      const candidates = Array.from(document.querySelectorAll(".card, .feature-card, .catalog-item, .rule-wave article, .grace-ladder article, .prole-tree"))
        .filter(function (element) {
          return element.offsetParent !== null && !element.closest(".trickster-widget");
        });

      if (!candidates.length) {
        speak("Não achei nada para esconder.");
        return;
      }

      const target = candidates[Math.floor(Math.random() * candidates.length)];
      target.classList.add("trick-hidden");
      speak("Guardei uma coisa no redemoinho.");
      window.setTimeout(function () {
        target.classList.remove("trick-hidden");
      }, 4500);
    }

    function shuffleCards() {
      burstWind();
      const containers = Array.from(document.querySelectorAll(".cards, .intro-grid, .catalog-grid, .prole-grid, .grace-ladder"))
        .filter(function (container) {
          return container.children.length > 1 && container.offsetParent !== null;
        });

      if (!containers.length) {
        speak("Nada para embaralhar aqui.");
        return;
      }

      const container = containers[0];
      container.dataset.originalOrder = "true";
      Array.from(container.children).forEach(function (child, index) {
        if (!child.dataset.originalIndex) child.dataset.originalIndex = String(index);
      });

      Array.from(container.children)
        .sort(function () {
          return Math.random() - 0.5;
        })
        .forEach(function (child) {
          container.appendChild(child);
        });

      speak("Troquei umas trilhas de lugar.");
    }

    function dashAcrossSystem() {
      burstWind();
      playWhistle();
      const targets = Array.from(document.querySelectorAll(".system-flow, .cards, .intro-grid, .catalog-grid, .prole-grid"))
        .filter(function (element) {
          return element.offsetParent !== null;
        });
      const target = targets[0] || document.querySelector("main");
      if (target) {
        target.classList.remove("saci-dash-target");
        window.requestAnimationFrame(function () {
          target.classList.add("saci-dash-target");
        });
        window.setTimeout(function () {
          target.classList.remove("saci-dash-target");
        }, 1400);
      }
      avatar.classList.add("is-running");
      window.setTimeout(function () {
        avatar.classList.remove("is-running");
      }, 900);
      speak("Passei num redemoinho.");
    }

    avatar.addEventListener("click", function () {
      const open = panel.hasAttribute("hidden");
      panel.hidden = !open;
      avatar.setAttribute("aria-expanded", String(open));
      if (open) {
        playWhistle();
        speak("Psiu. Quer uma travessura?");
      }
    });

    widget.addEventListener("click", function (event) {
      const action = event.target.dataset.trick;
      if (!action) return;
      if (action === "shake") shake();
      if (action === "hide") hideSomething();
      if (action === "shuffle") shuffleCards();
      if (action === "dash") dashAcrossSystem();
      if (action === "restore") restore();
    });
  }

  function setupScrollPolish() {
    if (document.body.classList.contains("admin-page")) return;

    function updateHeaderState() {
      document.body.classList.toggle("is-page-scrolled", window.scrollY > 18);
    }

    const targets = Array.from(document.querySelectorAll(
      ".system-quickbar, .system-flow, .rule-wave article, .prole-tree, .grace-ladder article, .catalog-item, .feature-card, .member-card, .stat-card"
    ));

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (target) {
      target.classList.add("scroll-soft");
      observer.observe(target);
    });

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupActiveNavigation();
    setupFolkloreTrickster();
    setupScrollPolish();
    applySettings();
  });

  window.addEventListener("hashchange", setupActiveNavigation);
  window.addEventListener("storage", applySettings);
  window.EraX = Object.assign(window.EraX || {}, { applySettings: applySettings });
})();
