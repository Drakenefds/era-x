(function () {
  const state = {
    user: null,
    apiOnline: false,
    tags: [],
    characters: [],
    users: [],
    selectedTagId: null
  };

  const ADMIN_SETTINGS_KEY = "adminPanelSettings";
  const ADMIN_PRESETS = {
    classic: { label: "Classico da mata", color: "#e3a331" },
    gold: { label: "Arquivo dourado", color: "#d9b45f" },
    river: { label: "Rio noturno", color: "#45a6b0" },
    ember: { label: "Brasa ritual", color: "#d76844" }
  };

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setText(selector, value) {
    const element = qs(selector);
    if (element) element.textContent = value;
  }

  async function api(path, options) {
    const response = await fetch(path, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      ...options
    });
    const data = await response.json().catch(function () {
      return {};
    });
    if (!response.ok) {
      throw new Error(data.error || "Erro ao falar com o servidor.");
    }
    return data;
  }

  function setStatus(message, detail, ok) {
    const status = qs("[data-api-status]");
    if (!status) return;
    status.classList.toggle("is-ok", Boolean(ok));
    status.classList.toggle("is-error", ok === false);
    status.innerHTML = `<strong>${escapeHtml(message)}</strong><span>${escapeHtml(detail || "")}</span>`;
  }

  function setPanels() {
    const loginPanel = qs("[data-login-panel]");
    const sessionPanel = qs("[data-session-panel]");
    const content = qs("[data-admin-content]");
    const sessionText = qs("[data-session-text]");
    const metrics = qs("[data-admin-metrics]");

    if (loginPanel) loginPanel.hidden = Boolean(state.user);
    if (sessionPanel) sessionPanel.hidden = !state.user;
    if (content) content.hidden = !state.user;
    if (metrics) metrics.hidden = !state.user;

    if (sessionText && state.user) {
      sessionText.textContent = `Conectado como ${state.user.username} (${state.user.role}).`;
    }

    qsa("[data-admin-only]").forEach(function (element) {
      element.hidden = !state.user || state.user.role !== "admin";
    });

    updateMetrics();
  }

  function updateMetrics() {
    setText("[data-metric-characters]", String(state.characters.length || 0));
    setText("[data-metric-tags]", String(state.tags.length || 0));
    setText("[data-metric-users]", state.user && state.user.role === "admin" ? String(state.users.length || 0) : "-");
    setText("[data-metric-role]", state.user ? state.user.role : "-");
  }

  async function checkSession() {
    try {
      const data = await api("/api/me");
      state.apiOnline = true;
      state.user = data.user;
      setStatus(
        state.user ? "Banco conectado." : "Banco conectado, aguardando login.",
        state.user ? "Voce pode cadastrar fichas e gerenciar o painel." : "Entre com a conta admin inicial.",
        true
      );
      setPanels();
      await loadAssets();
      await loadTagTools();
      if (state.user && state.user.role === "admin") {
        await loadUsers();
      } else {
        state.users = [];
        updateMetrics();
      }
    } catch (error) {
      state.apiOnline = false;
      state.user = null;
      state.tags = [];
      state.characters = [];
      state.users = [];
      setStatus("Banco offline.", "Rode `python server.py` e acesse por http://localhost:5500/admin.html.", false);
      setPanels();
    }
  }

  async function login() {
    try {
      const username = getValue("login-username");
      const password = getValue("login-password");
      const data = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      state.user = data.user;
      setStatus("Login realizado.", "Sessao criada no servidor local.", true);
      setPanels();
      await loadAssets();
      await loadTagTools();
      if (state.user.role === "admin") await loadUsers();
    } catch (error) {
      alert(error.message);
    }
  }

  async function logout() {
    await api("/api/logout", { method: "POST", body: "{}" }).catch(function () {});
    state.user = null;
    setPanels();
    setStatus("Voce saiu.", "Entre novamente para editar o banco.", true);
  }

  async function createUser() {
    try {
      await api("/api/users", {
        method: "POST",
        body: JSON.stringify({
          username: getValue("new-username"),
          password: getValue("new-password"),
          role: getValue("new-role") || "editor"
        })
      });
      document.getElementById("new-username").value = "";
      document.getElementById("new-password").value = "";
      await loadUsers();
      alert("Conta criada.");
    } catch (error) {
      alert(error.message);
    }
  }

  async function loadUsers() {
    const list = qs("[data-user-list]");
    if (!list) return;
    try {
      const data = await api("/api/users");
      state.users = data.users || [];
      list.innerHTML = "";
      state.users.forEach(function (user) {
        const item = document.createElement("div");
        item.className = "user-row";
        item.innerHTML = `<strong>${escapeHtml(user.username)}</strong><span>${escapeHtml(user.role)}</span>`;
        list.appendChild(item);
      });
      updateMetrics();
    } catch (error) {
      state.users = [];
      list.textContent = error.message;
      updateMetrics();
    }
  }

  async function loadAssets() {
    const select = document.getElementById("c-image-select");
    if (!select) return;
    try {
      const data = await api("/api/assets");
      select.innerHTML = `<option value="">Escolha uma imagem</option>`;
      data.assets.forEach(function (asset) {
        const option = document.createElement("option");
        option.value = asset.path;
        option.textContent = asset.name;
        select.appendChild(option);
      });
    } catch (error) {
      select.innerHTML = `<option value="">Servidor offline</option>`;
    }
  }

  async function loadTagTools() {
    if (!state.user) return;
    await Promise.all([loadTags(), loadCharactersForTags()]);
    if (state.selectedTagId && !state.tags.some(function (tag) { return Number(tag.id) === Number(state.selectedTagId); })) {
      state.selectedTagId = null;
    }
    renderTagChecks();
    renderTagList();
    renderTagInspector();
    updateMetrics();
  }

  async function loadTags() {
    try {
      const data = await api("/api/tags");
      state.tags = data.tags || [];
    } catch (error) {
      state.tags = [];
    }
  }

  async function loadCharactersForTags() {
    const select = document.getElementById("tag-character-select");
    if (!select) return;
    try {
      const data = await api("/api/characters");
      state.characters = data.characters || [];
      select.innerHTML = `<option value="">Escolha uma ficha</option>`;
      state.characters.forEach(function (character) {
        const option = document.createElement("option");
        option.value = character.id;
        option.textContent = `${character.name} (${character.type})`;
        select.appendChild(option);
      });
    } catch (error) {
      state.characters = [];
      select.innerHTML = `<option value="">Servidor offline</option>`;
    }
  }

  function selectedCharacter() {
    const id = Number(getValue("tag-character-select"));
    return state.characters.find(function (character) {
      return Number(character.id) === id;
    });
  }

  function characterTagNames(character) {
    return (character && character.tag ? character.tag : "")
      .split(",")
      .map(function (tag) {
        return tag.trim().toLowerCase();
      })
      .filter(Boolean);
  }

  function renderTagChecks() {
    const box = qs("[data-tag-checks]");
    if (!box) return;
    const activeNames = characterTagNames(selectedCharacter());
    box.innerHTML = "";

    if (!state.tags.length) {
      box.innerHTML = `<p class="muted-text">Nenhuma tag criada ainda.</p>`;
      return;
    }

    state.tags.forEach(function (tag) {
      const label = document.createElement("label");
      label.className = "tag-check";
      label.style.setProperty("--tag-color", tag.color || "#e3a331");
      label.innerHTML = `
        <input type="checkbox" value="${tag.id}" ${activeNames.includes(String(tag.name).toLowerCase()) ? "checked" : ""}>
        <span>${escapeHtml(tag.name)}</span>
      `;
      box.appendChild(label);
    });
  }

  function renderTagList() {
    const list = qs("[data-tag-list]");
    if (!list) return;
    list.innerHTML = "";

    if (!state.tags.length) {
      list.innerHTML = `<p class="muted-text">Nenhuma tag criada ainda.</p>`;
      return;
    }

    state.tags.forEach(function (tag) {
      const item = document.createElement("div");
      item.className = "tag-row";
      item.classList.toggle("is-selected", Number(state.selectedTagId) === Number(tag.id));
      item.style.setProperty("--tag-color", tag.color || "#e3a331");
      item.innerHTML = `
        <button class="tag-row-main" type="button" data-view-tag="${tag.id}">
          <span>${escapeHtml(tag.name)}</span>
          <small>${tag.uses || 0} usos</small>
        </button>
        ${state.user && state.user.role === "admin" ? `<button type="button" data-delete-tag="${tag.id}">Remover</button>` : ""}
      `;
      list.appendChild(item);
    });
  }

  function renderTagInspector() {
    const box = qs("[data-tag-inspector]");
    if (!box) return;
    const tag = state.tags.find(function (item) {
      return Number(item.id) === Number(state.selectedTagId);
    });

    if (!tag) {
      box.innerHTML = `
        <small>Mapa da tag</small>
        <strong>Escolha uma tag</strong>
        <p>Clique em qualquer tag abaixo para ver as fichas conectadas.</p>
      `;
      return;
    }

    const tagName = String(tag.name || "").toLowerCase();
    const matches = state.characters.filter(function (character) {
      return characterTagNames(character).includes(tagName);
    });
    const items = matches.map(function (character) {
      return `
        <li>
          <span>${escapeHtml(character.name)}</span>
          <em>${escapeHtml(character.type || "ficha")}</em>
        </li>
      `;
    }).join("");

    box.style.setProperty("--tag-color", tag.color || "#e3a331");
    box.innerHTML = `
      <small>Mapa da tag</small>
      <strong>${escapeHtml(tag.name)}</strong>
      <p>${matches.length} ficha${matches.length === 1 ? "" : "s"} conectada${matches.length === 1 ? "" : "s"}.</p>
      <ul>${items || "<li><span>Nenhuma ficha atribuida.</span><em>vazio</em></li>"}</ul>
    `;
  }

  async function createTag() {
    try {
      await api("/api/tags", {
        method: "POST",
        body: JSON.stringify({
          name: getValue("tag-name"),
          color: getValue("tag-color") || "#e3a331"
        })
      });
      document.getElementById("tag-name").value = "";
      await loadTagTools();
      alert("Tag criada.");
    } catch (error) {
      alert(error.message);
    }
  }

  async function saveCharacterTags() {
    const characterId = getValue("tag-character-select");
    if (!characterId) {
      alert("Escolha uma ficha primeiro.");
      return;
    }
    const tagIds = qsa("[data-tag-checks] input:checked").map(function (input) {
      return Number(input.value);
    });
    try {
      await api(`/api/characters/${characterId}/tags`, {
        method: "POST",
        body: JSON.stringify({ tagIds })
      });
      await loadTagTools();
      document.getElementById("tag-character-select").value = characterId;
      renderTagChecks();
      renderTagInspector();
      alert("Tags atualizadas.");
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteTag(tagId) {
    if (!confirm("Remover esta tag de todas as fichas?")) return;
    try {
      await api(`/api/tags/${tagId}`, { method: "DELETE" });
      if (Number(state.selectedTagId) === Number(tagId)) state.selectedTagId = null;
      await loadTagTools();
      alert("Tag removida.");
    } catch (error) {
      alert(error.message);
    }
  }

  async function saveChar() {
    const selectedImage = getValue("c-image-path") || getValue("c-image-select");
    const payload = {
      name: getValue("c-name"),
      title: getValue("c-title"),
      type: getValue("c-type") || "entidade",
      region: getValue("c-region"),
      tag: getValue("c-tag"),
      desc: getValue("c-desc"),
      historia: getValue("c-historia"),
      poderes: getValue("c-poderes"),
      curiosidades: getValue("c-curiosidades"),
      image: selectedImage,
      color: getValue("c-color") || "#e3a331"
    };

    try {
      await api("/api/characters", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      qsa("#c-name, #c-title, #c-region, #c-tag, #c-desc, #c-historia, #c-poderes, #c-curiosidades, #c-image-path").forEach(function (field) {
        field.value = "";
      });
      const imageSelect = document.getElementById("c-image-select");
      if (imageSelect) imageSelect.value = "";
      await loadTagTools();
      alert("Ficha salva no banco.");
    } catch (error) {
      alert(error.message);
    }
  }

  function readAdminSettings() {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_SETTINGS_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function syncAdminFields(settings) {
    const defaults = {
      preset: "classic",
      primary: "#e3a331",
      font: "Montserrat",
      density: "comfort",
      motion: "soft",
      note: "",
      customCss: "",
      customHtml: ""
    };
    const data = { ...defaults, ...settings };
    const fields = {
      "a-preset": data.preset,
      "a-color": data.primary,
      "a-font": data.font,
      "a-density": data.density,
      "a-motion": data.motion,
      "a-note": data.note,
      "a-custom-css": data.customCss,
      "a-custom-html": data.customHtml
    };
    Object.keys(fields).forEach(function (id) {
      const element = document.getElementById(id);
      if (element) element.value = fields[id];
    });
  }

  function applyAdminVisual(settings) {
    const data = {
      preset: settings.preset || "classic",
      primary: settings.primary || "#e3a331",
      font: settings.font || "Montserrat",
      density: settings.density || "comfort",
      motion: settings.motion || "soft",
      note: settings.note || "",
      customCss: settings.customCss || "",
      customHtml: settings.customHtml || ""
    };

    document.documentElement.style.setProperty("--sun", data.primary);
    document.body.style.fontFamily = data.font + ", Arial, sans-serif";
    document.body.classList.remove("admin-theme-classic", "admin-theme-gold", "admin-theme-river", "admin-theme-ember");
    document.body.classList.add(`admin-theme-${data.preset}`);
    document.body.classList.remove("admin-density-comfort", "admin-density-compact", "admin-density-wide");
    document.body.classList.add(`admin-density-${data.density}`);
    document.body.classList.remove("admin-motion-soft", "admin-motion-calm", "admin-motion-none");
    document.body.classList.add(`admin-motion-${data.motion}`);

    let style = document.getElementById("admin-custom-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "admin-custom-style";
      document.head.appendChild(style);
    }
    style.textContent = data.customCss;

    const preview = qs("[data-admin-html-preview]");
    if (preview) {
      const noteHtml = data.note ? `<strong>Aviso:</strong> ${escapeHtml(data.note)}` : "";
      preview.innerHTML = data.customHtml || noteHtml;
      preview.hidden = !data.customHtml && !data.note;
    }

    renderVisualPreview(data);
  }

  function previewAdminVisual() {
    applyAdminVisual({
      preset: getValue("a-preset"),
      primary: getValue("a-color"),
      font: getValue("a-font"),
      density: getValue("a-density"),
      motion: getValue("a-motion"),
      note: getValue("a-note"),
      customCss: getValue("a-custom-css"),
      customHtml: getValue("a-custom-html")
    });
    hideVisualConfirmation();
  }

  function visualDataLabel(key, value) {
    const labels = {
      preset: "Tema",
      primary: "Cor",
      font: "Fonte",
      density: "Densidade",
      motion: "Movimento",
      note: "Aviso visual",
      customCss: "CSS tecnico",
      customHtml: "HTML tecnico"
    };
    if (key === "preset") return `${labels[key]}: ${(ADMIN_PRESETS[value] || ADMIN_PRESETS.classic).label}`;
    if (key === "density") return `${labels[key]}: ${value === "compact" ? "Compacta" : value === "wide" ? "Ampla" : "Confortavel"}`;
    if (key === "motion") return `${labels[key]}: ${value === "none" ? "Sem animacao" : value === "calm" ? "Calmo" : "Suave"}`;
    if (key === "font") return `${labels[key]}: ${value === "Georgia" ? "Livro antigo" : value === "Arial" ? "Simples" : "Moderna"}`;
    if (key === "customCss" || key === "customHtml") return `${labels[key]}: ${value ? "com conteudo" : "vazio"}`;
    if (key === "note") return `${labels[key]}: ${value || "nenhum"}`;
    return `${labels[key] || key}: ${value}`;
  }

  function getVisualChanges(nextSettings) {
    const current = {
      preset: "classic",
      primary: "#e3a331",
      font: "Montserrat",
      density: "comfort",
      motion: "soft",
      note: "",
      customCss: "",
      customHtml: "",
      ...readAdminSettings()
    };
    return ["preset", "primary", "font", "density", "motion", "note", "customCss", "customHtml"]
      .filter(function (key) {
        return String(current[key] || "") !== String(nextSettings[key] || "");
      })
      .map(function (key) {
        return visualDataLabel(key, nextSettings[key] || "");
      });
  }

  function renderVisualPreview(data) {
    const preset = ADMIN_PRESETS[data.preset] || ADMIN_PRESETS.classic;
    const title = qs("[data-preview-title]");
    const mini = qs("[data-mini-preview]");
    const miniText = qs("[data-mini-preview-text]");
    if (title) title.textContent = preset.label;
    if (mini) {
      mini.style.setProperty("--preview-color", data.primary || preset.color);
      mini.dataset.motion = data.motion || "soft";
      mini.dataset.density = data.density || "comfort";
    }
    if (miniText) {
      miniText.textContent = data.note || "Preview do visual antes de salvar.";
    }
  }

  function showVisualConfirmation(data) {
    const box = qs("[data-visual-confirm]");
    const list = qs("[data-visual-change-list]");
    if (!box || !list) return;
    const changes = getVisualChanges(data);
    list.innerHTML = "";
    (changes.length ? changes : ["Nenhuma mudanca nova; o visual ja esta assim."]).forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    box.hidden = false;
  }

  function hideVisualConfirmation() {
    const box = qs("[data-visual-confirm]");
    if (box) box.hidden = true;
  }

  function saveSite() {
    const data = {
      preset: getValue("a-preset") || "classic",
      primary: getValue("a-color"),
      font: getValue("a-font"),
      density: getValue("a-density") || "comfort",
      motion: getValue("a-motion") || "soft",
      note: getValue("a-note"),
      customCss: getValue("a-custom-css"),
      customHtml: getValue("a-custom-html")
    };
    applyAdminVisual(data);
    showVisualConfirmation(data);
  }

  function confirmAdminVisual() {
    const data = {
      preset: getValue("a-preset") || "classic",
      primary: getValue("a-color"),
      font: getValue("a-font"),
      density: getValue("a-density") || "comfort",
      motion: getValue("a-motion") || "soft",
      note: getValue("a-note"),
      customCss: getValue("a-custom-css"),
      customHtml: getValue("a-custom-html")
    };
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(data));
    applyAdminVisual(data);
    hideVisualConfirmation();
    alert("Visual do admin atualizado.");
  }

  function cancelAdminVisual() {
    const settings = readAdminSettings();
    syncAdminFields(settings);
    applyAdminVisual(settings);
    hideVisualConfirmation();
  }

  function resetSite() {
    if (!confirm("Deseja apagar as preferencias visuais do painel admin?")) return;
    localStorage.removeItem(ADMIN_SETTINGS_KEY);
    syncAdminFields({});
    applyAdminVisual({});
    hideVisualConfirmation();
  }

  function hydrateAdminFields() {
    const settings = readAdminSettings();
    syncAdminFields(settings);
    applyAdminVisual(settings);
  }

  function updateRolePreview() {
    const role = getValue("new-role") || "editor";
    qsa("[data-role-card]").forEach(function (card) {
      card.classList.toggle("is-active", card.dataset.roleCard === role);
    });
  }

  function setupAdminReveals() {
    const items = qsa(".admin-reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
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
    }, { threshold: 0.12 });
    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupScrollMeter() {
    const meter = qs("[data-scroll-meter]");
    if (!meter) return;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      meter.style.transform = `scaleX(${progress})`;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function bindAdminEvents() {
    const bindings = [
      ["[data-login]", login],
      ["[data-logout]", logout],
      ["[data-create-user]", createUser],
      ["[data-save-character]", saveChar],
      ["[data-save-site]", saveSite],
      ["[data-reset-site]", resetSite],
      ["[data-refresh-admin]", checkSession],
      ["[data-create-tag]", createTag],
      ["[data-save-character-tags]", saveCharacterTags],
      ["[data-refresh-tags]", loadTagTools],
      ["[data-preview-admin-visual]", previewAdminVisual],
      ["[data-confirm-admin-visual]", confirmAdminVisual],
      ["[data-cancel-admin-visual]", cancelAdminVisual]
    ];

    bindings.forEach(function (binding) {
      const element = qs(binding[0]);
      if (element) element.addEventListener("click", binding[1]);
    });

    const characterTagSelect = document.getElementById("tag-character-select");
    if (characterTagSelect) {
      characterTagSelect.addEventListener("change", renderTagChecks);
    }

    const roleSelect = document.getElementById("new-role");
    if (roleSelect) {
      roleSelect.addEventListener("change", updateRolePreview);
      updateRolePreview();
    }

    const presetSelect = document.getElementById("a-preset");
    if (presetSelect) {
      presetSelect.addEventListener("change", function () {
        const preset = ADMIN_PRESETS[getValue("a-preset")] || ADMIN_PRESETS.classic;
        const color = document.getElementById("a-color");
        if (color) color.value = preset.color;
        previewAdminVisual();
      });
    }

    qsa("#a-color, #a-font, #a-density, #a-motion, #a-note, #a-custom-css, #a-custom-html").forEach(function (field) {
      field.addEventListener("input", previewAdminVisual);
    });

    const tagList = qs("[data-tag-list]");
    if (tagList) {
      tagList.addEventListener("click", function (event) {
        const deleteButton = event.target.closest("[data-delete-tag]");
        if (deleteButton) {
          deleteTag(deleteButton.dataset.deleteTag);
          return;
        }
        const viewButton = event.target.closest("[data-view-tag]");
        if (viewButton) {
          state.selectedTagId = Number(viewButton.dataset.viewTag);
          renderTagList();
          renderTagInspector();
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    hydrateAdminFields();
    setupAdminReveals();
    setupScrollMeter();
    bindAdminEvents();
    checkSession();
  });
})();
