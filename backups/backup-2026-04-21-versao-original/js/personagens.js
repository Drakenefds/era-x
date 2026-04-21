function loadCharacters() {
  const container = document.querySelector(".cards");
  if (!container) return;

  const chars = JSON.parse(localStorage.getItem("chars")) || [];
  container.innerHTML = "";

  chars.forEach(c => {
    const card = document.createElement("div");
    card.className = "card wiki-card";
    card.dataset.type = c.type;

    card.innerHTML = `
      ${c.image ? `<img src="${c.image}">` : ""}
      <h3 style="color:${c.color || "#00ff22"}">${c.name}</h3>
      <small><em>${c.title || ""}</em></small>
      <p>${c.desc || ""}</p>

      <button onclick='openWiki(${JSON.stringify(c)})'>Ver ficha</button>
      <button class="delete-btn" onclick="deleteChar(${c.id})">Apagar</button>
    `;

    container.appendChild(card);
  });
}

/* ===== WIKI ===== */
function openWiki(c) {
  document.getElementById("wikiImage").src = c.image || "";
  document.getElementById("wikiName").textContent = c.name;
  document.getElementById("wikiTitle").textContent = c.title || "";
  document.getElementById("wikiType").textContent = c.type;
  document.getElementById("wikiRegion").textContent = c.region || "—";
  document.getElementById("wikiTag").textContent = c.tag || "—";

  const tabs = [
    { id: "historia", label: "História", content: c.historia },
    { id: "poderes", label: "Poderes", content: c.poderes },
    { id: "aparicoes", label: "Aparições", content: c.aparicoes },
    { id: "curiosidades", label: "Curiosidades", content: c.curiosidades }
  ];

  const tabsContainer = document.getElementById("wikiTabs");
  const contentContainer = document.getElementById("wikiTabContent");

  tabsContainer.innerHTML = "";
  contentContainer.innerHTML = "";

  tabs.forEach((t, i) => {
    if (!t.content) return;

    const btn = document.createElement("button");
    btn.textContent = t.label;
    btn.className = i === 0 ? "active" : "";
    btn.onclick = () => switchTab(t, btn);
    tabsContainer.appendChild(btn);

    if (i === 0) contentContainer.innerHTML = `<p>${t.content}</p>`;
  });

  document.getElementById("wikiModal").style.display = "flex";
}

function switchTab(tab, btn) {
  document.querySelectorAll(".wiki-tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("wikiTabContent").innerHTML = `<p>${tab.content}</p>`;
}

function closeWiki() {
  document.getElementById("wikiModal").style.display = "none";
}

/* ===== FILTRO ===== */
function filterCards(type, event) {
  document.querySelectorAll(".filters button")
    .forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");

  document.querySelectorAll(".card").forEach(card => {
    card.style.display =
      type === "all" || card.dataset.type === type ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", loadCharacters);
