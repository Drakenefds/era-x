document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("admin-toggle");
  const panel = document.getElementById("admin-panel");

  if (btn && panel) {
    btn.onclick = () => {
      panel.classList.toggle("open");
    };
  }

  applySettings();
});

/* ================= SITE ================= */
function saveSite() {
  const data = {
    primary: document.getElementById("a-color")?.value,
    font: document.getElementById("a-font")?.value,
    heroTitle: document.getElementById("a-title")?.value,
    heroDesc: document.getElementById("a-desc")?.value
  };

  localStorage.setItem("siteSettings", JSON.stringify(data));
  applySettings();
  alert("Visual atualizado!");
}

function applySettings() {
  const data = JSON.parse(localStorage.getItem("siteSettings"));
  if (!data) return;

  if (data.primary)
    document.documentElement.style.setProperty("--accent", data.primary);

  if (data.font)
    document.body.style.fontFamily = data.font;

  const heroTitle =
    document.querySelector(".hero-content h1") ||
    document.querySelector(".hero-title");

  const heroDesc =
    document.querySelector(".hero-content p") ||
    document.querySelector(".hero-description");

  if (heroTitle && data.heroTitle)
    heroTitle.innerHTML = data.heroTitle;

  if (heroDesc && data.heroDesc)
    heroDesc.textContent = data.heroDesc;
}

/* ================= PERSONAGENS ================= */
function saveChar() {
  const name = document.getElementById("c-name")?.value;
  const type = document.getElementById("c-type")?.value;
  const desc = document.getElementById("c-desc")?.value;
  const color = document.getElementById("c-color")?.value || "#00ff22";
  const file = document.getElementById("c-image")?.files[0];

  if (!name || !desc) {
    alert("Preencha nome e descrição.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const chars = JSON.parse(localStorage.getItem("chars")) || [];

    chars.push({
      id: Date.now(),
      name,
      type,
      desc,
      color,
      image: reader.result
    });

    localStorage.setItem("chars", JSON.stringify(chars));
    alert("Personagem salvo!");
    location.reload();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
}
/* ================= APAGAR SITE ================= */
function resetSite() {
  if (!confirm("Deseja apagar TODAS as configurações visuais do site?")) return;

  localStorage.removeItem("siteSettings");
  alert("Configurações do site apagadas.");
  location.reload();
}

/* ================= APAGAR PERSONAGEM ================= */
function deleteChar(id) {
  if (!confirm("Deseja apagar este personagem?")) return;

  const chars = JSON.parse(localStorage.getItem("chars")) || [];
  const filtered = chars.filter(c => c.id !== id);

  localStorage.setItem("chars", JSON.stringify(filtered));
  alert("Personagem removido!");
  location.reload();
}

/* ================= LIMPEZA TOTAL (OPCIONAL) ================= */
function resetAll() {
  if (!confirm("ISS0 APAGARÁ TUDO. Tem certeza absoluta?")) return;

  localStorage.clear();
  alert("Todos os dados locais foram apagados.");
  location.reload();
}
function saveChar() {
  const name = document.getElementById("c-name")?.value;
  const type = document.getElementById("c-type")?.value;
  const desc = document.getElementById("c-desc")?.value;
  const color = document.getElementById("c-color")?.value || "#00ff22";
  const file = document.getElementById("c-image")?.files[0];

  const title = document.getElementById("c-title")?.value || "";
  const region = document.getElementById("c-region")?.value || "";
  const tag = document.getElementById("c-tag")?.value || "";
  const lore = document.getElementById("c-lore")?.value || "";

  if (!name || !desc) {
    alert("Preencha nome e descrição.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const chars = JSON.parse(localStorage.getItem("chars")) || [];

    chars.push({
      id: Date.now(),
      name,
      type,
      desc,
      color,
      image: reader.result,
      title,
      region,
      tag,
      lore
    });

    localStorage.setItem("chars", JSON.stringify(chars));
    alert("Personagem salvo!");
    location.reload();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
}
  