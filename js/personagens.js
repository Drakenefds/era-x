(function () {
  const fallbackCharacters = [
    {
      id: "fallback-curupira",
      seed: true,
      name: "Curupira",
      title: "Guardião dos caminhos trocados",
      type: "entidade",
      region: "Mata dos Caminhos Trocados",
      tag: "mata, proteção, rastros",
      desc: "Entidade protetora das florestas, conhecida por punir caçadores cruéis e confundir invasores.",
      historia: "Rode `python server.py` para carregar o catálogo completo do banco SQLite.",
      poderes: "Rastro Invertido, Fúria da Mata e Labirinto Vivo.",
      curiosidades: "Esta é uma ficha reserva para quando o banco local não estiver rodando.",
      image: "imagens/curupira.jpg",
      color: "#e3a331"
    }
  ];

  let charactersCache = [];

  async function fetchCharacters() {
    try {
      const response = await fetch("/api/characters", { credentials: "same-origin" });
      if (!response.ok) throw new Error("API offline");
      const data = await response.json();
      return data.characters || [];
    } catch (error) {
      return fallbackCharacters.concat(JSON.parse(localStorage.getItem("chars") || "[]"));
    }
  }

  function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function createText(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text || "";
    if (className) element.className = className;
    return element;
  }

  async function loadCharacters(filter) {
    const container = document.getElementById("characterCards");
    if (!container) return;

    if (!charactersCache.length) charactersCache = await fetchCharacters();
    clearChildren(container);

    const characters = charactersCache.filter(function (char) {
      return !filter || filter === "all" || char.type === filter;
    });

    if (!characters.length) {
      container.appendChild(createText("div", "Nenhuma ficha encontrada para este filtro.", "empty-state"));
      return;
    }

    characters.forEach(function (char) {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.type = char.type;

      if (char.image) {
        const img = document.createElement("img");
        img.src = char.image;
        img.alt = char.name;
        card.appendChild(img);
      }

      const body = document.createElement("div");
      body.className = "card-body";

      const name = createText("h3", char.name);
      name.style.color = char.color || "#e3a331";
      body.appendChild(name);
      body.appendChild(createText("small", char.title || char.type));
      body.appendChild(createText("p", char.desc || "Ficha sem descrição."));

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const openButton = createText("button", "Ver ficha", "primary");
      openButton.type = "button";
      openButton.addEventListener("click", function () {
        openWiki(char);
      });
      actions.appendChild(openButton);

      body.appendChild(actions);
      card.appendChild(body);
      container.appendChild(card);
    });
  }

  function openWiki(char) {
    const modal = document.getElementById("wikiModal");
    if (!modal) return;

    const image = document.getElementById("wikiImage");
    image.src = char.image || "imagens/folclore.jpg";
    image.alt = char.name || "Ficha";

    document.getElementById("wikiName").textContent = char.name || "Sem nome";
    document.getElementById("wikiTitle").textContent = char.title || "Ficha de personagem";
    document.getElementById("wikiType").textContent = char.type || "sem tipo";
    document.getElementById("wikiRegion").textContent = char.region || "não definida";
    document.getElementById("wikiTag").textContent = char.tag || "sem tags";
    document.getElementById("wikiDesc").textContent = char.desc || "";

    const tabs = [
      { label: "História", content: char.historia },
      { label: "Poderes", content: char.poderes },
      { label: "Curiosidades", content: char.curiosidades }
    ].filter(function (tab) {
      return tab.content;
    });

    const tabsContainer = document.getElementById("wikiTabs");
    const contentContainer = document.getElementById("wikiTabContent");
    clearChildren(tabsContainer);
    clearChildren(contentContainer);

    tabs.forEach(function (tab, index) {
      const button = createText("button", tab.label);
      button.type = "button";
      if (index === 0) button.classList.add("active");
      button.addEventListener("click", function () {
        Array.from(tabsContainer.children).forEach(function (child) {
          child.classList.remove("active");
        });
        button.classList.add("active");
        contentContainer.textContent = tab.content;
      });
      tabsContainer.appendChild(button);
      if (index === 0) contentContainer.textContent = tab.content;
    });

    if (!tabs.length) contentContainer.textContent = "Esta ficha ainda não possui abas detalhadas.";

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeWiki() {
    const modal = document.getElementById("wikiModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function getActiveFilter() {
    const active = document.querySelector(".filters button.active");
    return active ? active.dataset.filter : "all";
  }

  function setupFilters() {
    document.querySelectorAll(".filters button").forEach(function (button) {
      button.addEventListener("click", function () {
        document.querySelectorAll(".filters button").forEach(function (item) {
          item.classList.remove("active");
        });
        button.classList.add("active");
        loadCharacters(button.dataset.filter);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupFilters();
    loadCharacters("all");

    document.querySelectorAll("[data-close-modal]").forEach(function (button) {
      button.addEventListener("click", closeWiki);
    });

    const modal = document.getElementById("wikiModal");
    if (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) closeWiki();
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeWiki();
    });

    window.addEventListener("storage", function () {
      charactersCache = [];
      loadCharacters(getActiveFilter());
    });
  });
})();
