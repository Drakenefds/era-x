function applySettings(){
  const s = JSON.parse(localStorage.getItem("siteSettings")) || {};

  if(s.primary)
    document.documentElement.style.setProperty("--primary", s.primary);

  if(s.font)
    document.body.style.fontFamily = s.font;

  const t = document.querySelector(".hero-title");
  const d = document.querySelector(".hero-description");

  if(t && s.heroTitle) t.innerHTML = s.heroTitle;
  if(d && s.heroDesc) d.textContent = s.heroDesc;
}

document.addEventListener("DOMContentLoaded", applySettings);
window.addEventListener("storage", applySettings);
