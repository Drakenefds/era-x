(function () {
  const levels = Array.from({ length: 21 }, function (_, index) {
    return index * 5;
  });

  const rankText = [
    "centelha inicial",
    "sinal desperto",
    "eco pequeno",
    "marca visível",
    "domínio firme",
    "presença crescente",
    "força reconhecida",
    "autoridade local",
    "pacto consolidado",
    "ameaça lendária",
    "meio domínio",
    "manto aberto",
    "voz antiga",
    "território obediente",
    "forma superior",
    "presságio raro",
    "milagre temido",
    "lenda viva",
    "soberania mítica",
    "limiar divino",
    "apoteose"
  ];

  const scaleText = [
    "toques leves e sinais sutis",
    "efeitos curtos em cena calma",
    "vantagem pequena em conflito",
    "efeito claro por alguns turnos",
    "controle estável em área pequena",
    "reação forte contra ameaça direta",
    "proteção ou pressão sobre um grupo",
    "interferência marcante no ambiente",
    "efeito amplo com custo narrativo",
    "domínio perigoso em combate",
    "virada de cena uma vez por conflito",
    "presença que altera decisões fracas",
    "poder sustentado por cena inteira",
    "alteração de território próximo",
    "força capaz de enfrentar lendas menores",
    "milagre com consequência visível",
    "domínio quase inevitável no seu tema",
    "marca que permanece depois da cena",
    "fenômeno raro percebido por todos",
    "intervenção de escala lendária",
    "manifestação máxima, cobrada pela narrativa"
  ];

  const beings = [
    { category: "deuses", icon: "🌎", name: "Tupã", source: "trovões, criação, céu e justiça", themes: ["trovão", "vento sagrado", "ordem"], base: "relatos tupi-guarani sobre o senhor do trovão e criador" },
    { category: "deuses", icon: "🌕", name: "Jaci", source: "lua, noite, marés e presságios", themes: ["luar", "sonho", "maré"], base: "contos indígenas sobre a lua, fertilidade e proteção noturna" },
    { category: "deuses", icon: "☀️", name: "Guaraci", source: "sol, vida, coragem e revelação", themes: ["sol", "calor", "clareza"], base: "narrativas tupi-guarani ligadas ao sol e ao ciclo da vida" },
    { category: "deuses", icon: "🦌", name: "Anhangá", source: "mata, caça, culpa e punição", themes: ["assombro", "veado branco", "culpa"], base: "relatos de protetor das matas que pune caçadores cruéis" },
    { category: "deuses", icon: "❤️", name: "Rudá", source: "amor, desejo, união e saudade", themes: ["encanto", "coração", "saudade"], base: "tradições sobre o deus do amor e dos vínculos afetivos" },
    { category: "deuses", icon: "🖤", name: "Ticê", source: "noite, morte, silêncio e passagem", themes: ["sombra", "luto", "silêncio"], base: "mitos ligados à noite, ao repouso e aos limites da vida" },

    { category: "lendas", icon: "🦋", name: "Cuca", source: "pesadelo, bruxaria e medo infantil", themes: ["pesadelo", "feitiço", "vigília"], base: "cantigas, causos familiares e relatos de assombração noturna" },
    { category: "lendas", icon: "🔥", name: "Curupira", source: "floresta, rastros e vingança ecológica", themes: ["rastro invertido", "brasa", "mata"], base: "causos de guardião da mata que confunde caçadores" },
    { category: "lendas", icon: "🐬", name: "Boto Cor de Rosa", source: "sedução, festa, rio e segredo", themes: ["encanto", "rio", "disfarce"], base: "relatos amazônicos sobre o visitante das festas ribeirinhas" },
    { category: "lendas", icon: "🐗", name: "Caipora", source: "caça, animais e pacto da mata", themes: ["montaria", "fumo", "proteção"], base: "histórias de protetora dos bichos e das caçadas justas" },
    { category: "lendas", icon: "🪙", name: "Mãe-do-Ouro", source: "ouro, fogo-fátuo e tesouros ocultos", themes: ["ouro", "labareda", "cobiça"], base: "relatos de luzes sobre serras, minas e riquezas escondidas" },
    { category: "lendas", icon: "🎋", name: "Saci", source: "vento, trapaça, assobio e azar", themes: ["redemoinho", "assobio", "travessura"], base: "contos populares sobre o menino de uma perna e carapuça vermelha" },
    { category: "lendas", icon: "🦉", name: "Matinta Pereira", source: "assobio, cobrança e bruxaria", themes: ["assobio", "praga", "visita"], base: "relatos amazônicos de assobio noturno e promessa cobrada" },
    { category: "lendas", icon: "🧜🏾‍♀️", name: "Iara", source: "canto, água, beleza e afogamento", themes: ["canto", "correnteza", "espelho"], base: "causos de rios sobre a mãe-d'água e seu chamado" },

    { category: "devotos", icon: "🐍", name: "Devotos de Boitatá", source: "fogo, cobra de luz e proteção dos campos", themes: ["fogo vivo", "olhos de chama", "campo"], base: "relatos sobre a serpente luminosa que pune incêndios e profanações" },
    { category: "devotos", icon: "😇", name: "Cobra Norato e Maria Caninana", source: "dualidade, rio, serpente e destino", themes: ["pele de cobra", "rio profundo", "dualidade"], base: "narrativas amazônicas sobre Honorato e Caninana" },
    { category: "devotos", icon: "🛡️", name: "Icamiabas", source: "guerra, disciplina e proteção ancestral", themes: ["escudo", "flecha", "honra"], base: "relatos coloniais e lendas sobre guerreiras amazônicas" },
    { category: "devotos", icon: "🪷", name: "Vitória-Régia", source: "lago, lua, transformação e sacrifício", themes: ["lótus", "lago", "devoção"], base: "lenda indígena da jovem transformada em planta das águas" },

    { category: "espiritos", icon: "🦢", name: "Garça Branca", source: "pureza, margem, espera e aviso", themes: ["pluma", "margem", "presságio"], base: "observações ribeirinhas e simbolismo de aves das águas" },
    { category: "espiritos", icon: "🌺", name: "Beija-Flor", source: "velocidade, cura leve e alegria", themes: ["néctar", "vibração", "flor"], base: "relatos populares que ligam beija-flores a visita, sorte e delicadeza" },
    { category: "espiritos", icon: "🦅", name: "Harpia Brasileira", source: "altura, caça, visão e soberania", themes: ["garra", "altitude", "olhar"], base: "presença real da harpia nas matas e respeito dado à ave" },
    { category: "espiritos", icon: "🐕", name: "Lobo Guará", source: "cerrado, caminhada, faro e solidão", themes: ["faro", "cerrado", "passo longo"], base: "encontros do cerrado e simbolismo do lobo de pernas altas" },
    { category: "espiritos", icon: "🐍", name: "Sucuri", source: "força, água parada e constrição", themes: ["aperto", "brejo", "espera"], base: "relatos de rios, igarapés e encontros com grandes serpentes" },
    { category: "espiritos", icon: "💧", name: "Peixe Boi", source: "mansidão, resistência e memória d'água", themes: ["rio lento", "fôlego", "cuidado"], base: "observação amazônica do animal e sua ligação com águas calmas" },
    { category: "espiritos", icon: "🐢", name: "Jabuti", source: "paciência, astúcia e casco", themes: ["casco", "paciência", "truque"], base: "fábulas brasileiras em que o jabuti vence pela inteligência" },
    { category: "espiritos", icon: "🦜", name: "Arara Azul", source: "voz, cor, voo e memória", themes: ["pena azul", "grito", "bando"], base: "presença do Pantanal e lendas de aves mensageiras" },
    { category: "espiritos", icon: "🐒", name: "Mico Leão Dourado", source: "agilidade, união e alerta", themes: ["salto", "dourado", "bando"], base: "símbolo real da Mata Atlântica e da proteção coletiva" },
    { category: "espiritos", icon: "🐆", name: "Onça Pintada", source: "predação, sombra e majestade", themes: ["pintura", "emboscada", "rugido"], base: "relatos de mata sobre a maior caçadora das Américas" },

    { category: "encantados-maldicoes", icon: "🐚", name: "Sereias", source: "mar, voz, desejo e naufrágio", themes: ["canto salgado", "concha", "maré"], base: "relatos litorâneos sobre vozes no mar e encantamento de navegantes" },
    { category: "encantados-maldicoes", icon: "🐴", name: "Mula-Sem-Cabeça", source: "fogo, culpa, corrida e maldição", themes: ["chama", "galope", "castigo"], base: "causos rurais sobre aparição em noites marcadas" },
    { category: "encantados-maldicoes", icon: "🐺", name: "Lobisomem", source: "lua, fome, transformação e perseguição", themes: ["lua cheia", "garra", "faro"], base: "relatos rurais de sétimo filho, encruzilhada e fera noturna" },
    { category: "encantados-maldicoes", icon: "💀", name: "Corpo Seco", source: "maldição, terra recusada e rancor", themes: ["terra seca", "ossos", "rancor"], base: "causos sobre morto rejeitado pela terra por maldade extrema" }
  ];

  const categoryLabels = {
    deuses: "Deuses",
    lendas: "Lendas",
    devotos: "Devotos",
    espiritos: "Espíritos",
    "encantados-maldicoes": "Encantados e Maldições"
  };

  function slugify(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function powerText(being, level, index, type) {
    const theme = being.themes[index % being.themes.length];
    const nextTheme = being.themes[(index + 1) % being.themes.length];
    const rank = rankText[index];
    const scale = scaleText[index];

    if (type === "passive") {
      return `O vínculo com ${theme} fica em ${rank}: o personagem percebe sinais ligados a ${being.source} e recebe ${scale}.`;
    }

    return `Invoca ${nextTheme} por ação declarada. Em domínio ${level}, o efeito gera ${scale}, mas exige cena, foco ou consequência coerente com ${being.base}.`;
  }

  function createPowerRow(being, level, index) {
    const row = document.createElement("article");
    row.className = "power-row";

    const badge = document.createElement("div");
    badge.className = "power-level";
    badge.innerHTML = `<span>${level}</span><small>domínio</small>`;
    row.appendChild(badge);

    const passive = document.createElement("div");
    passive.className = "power-copy passive";
    passive.innerHTML = `<strong>✦ Passivo</strong><p>${powerText(being, level, index, "passive")}</p>`;
    row.appendChild(passive);

    const active = document.createElement("div");
    active.className = "power-copy active";
    active.innerHTML = `<strong>✦ Ativo</strong><p>${powerText(being, level, index, "active")}</p>`;
    row.appendChild(active);

    return row;
  }

  function createBeingCard(being) {
    const details = document.createElement("details");
    details.className = "being-card";
    details.dataset.category = being.category;
    details.dataset.name = being.name.toLowerCase();
    details.id = slugify(being.name);

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <span class="being-icon">${being.icon}</span>
      <span>
        <small>${categoryLabels[being.category]}</small>
        <strong>${being.name}</strong>
        <em>${being.source}</em>
      </span>
      <b>0-100</b>
    `;
    details.appendChild(summary);

    const body = document.createElement("div");
    body.className = "being-body";
    body.innerHTML = `
      <p><strong>Inspiração:</strong> ${being.base}.</p>
      <p><strong>Como usar:</strong> os efeitos escalam por domínio. Quanto maior o marco, maior a permissão narrativa e maior a cobrança do mestre.</p>
    `;

    const list = document.createElement("div");
    list.className = "power-list";
    levels.forEach(function (level, index) {
      list.appendChild(createPowerRow(being, level, index));
    });

    body.appendChild(list);
    details.appendChild(body);
    return details;
  }

  function createCategorySection(category, items) {
    const section = document.createElement("section");
    section.className = "powers-category";
    section.id = category;
    section.dataset.categorySection = category;

    const heading = document.createElement("div");
    heading.className = "powers-category-heading";
    heading.innerHTML = `
      <p class="eyebrow">${items.length} seres cadastrados</p>
      <h3>${categoryLabels[category]}</h3>
    `;
    section.appendChild(heading);

    items.forEach(function (being) {
      section.appendChild(createBeingCard(being));
    });

    return section;
  }

  function renderCatalog() {
    const catalog = document.getElementById("powersCatalog");
    if (!catalog) return;

    Object.keys(categoryLabels).forEach(function (category) {
      const items = beings.filter(function (being) {
        return being.category === category;
      });
      catalog.appendChild(createCategorySection(category, items));
    });
  }

  function applyFilters() {
    const search = (document.getElementById("powerSearch").value || "").trim().toLowerCase();
    const category = document.getElementById("powerCategory").value;

    document.querySelectorAll(".being-card").forEach(function (card) {
      const matchesName = !search || card.dataset.name.includes(search);
      const matchesCategory = category === "all" || card.dataset.category === category;
      card.hidden = !matchesName || !matchesCategory;
    });

    document.querySelectorAll("[data-category-section]").forEach(function (section) {
      const visible = Array.from(section.querySelectorAll(".being-card")).some(function (card) {
        return !card.hidden;
      });
      section.hidden = !visible;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCatalog();
    document.getElementById("powerSearch").addEventListener("input", applyFilters);
    document.getElementById("powerCategory").addEventListener("change", applyFilters);
  });
})();
