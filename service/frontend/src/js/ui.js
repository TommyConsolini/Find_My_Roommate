function escapeHtml(str) {
  return (str ?? "").toString()
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function uiToast(title, message) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<strong>${escapeHtml(title)}</strong><div>${escapeHtml(message)}</div>`;
  document.body.appendChild(t);
  setTimeout(() => { t.remove(); }, 3800);
}

// "occhio" per mostrare/nascondere password (login/register)
function uiInitPasswordToggles(){
  const btns = document.querySelectorAll(".pw-toggle[data-toggle]");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-toggle");
      const input = document.getElementById(id);
      if (!input) return;
      const isPw = input.type === "password";
      input.type = isPw ? "text" : "password";
      // Se il bottone contiene un'icona (img), non sovrascrivere il contenuto.
      if (!btn.querySelector("img")) {
        btn.textContent = isPw ? "🙈" : "👁";
      }

    });
  });
}

function buildDropdownHTML(isLogged, user) {

  if (!isLogged) {
    return `
      <div class="dd-head">
        <div class="dd-avatar">
          <img src="/img/avatar-default.png" alt="">
        </div>
        <div>
          <div class="dd-title">Accedi per usare tutte le funzioni</div>
          <div class="dd-sub">Profilo, annunci e messaggi sono disponibili dopo il login.</div>
        </div>
        <button class="dd-close">✕</button>
      </div>

      <div class="dd-auth">
        <a href="login.html">ACCEDI O REGISTRATI</a>
      </div>

      <div class="dd-list">
        <a class="dd-item" href="profile.html" data-requires-auth="1">
          <span>Profilo</span><span class="right">›</span>
        </a>

        <a class="dd-item" href="my-ads.html" data-requires-auth="1">
          <span>I miei annunci</span><span class="right">›</span>
        </a>

        <a class="dd-item" href="messages.html" data-requires-auth="1">
          <span>Messaggi</span><span class="right">›</span>
        </a>

        <div class="dd-sep"></div>

        <a class="dd-item dd-item-static" href="javascript:void(0)" aria-disabled="true">
          <span>Paese</span>
          <span class="right"><span class="dd-value">Italia</span><span class="arrow">›</span></span>
        </a>

        <a class="dd-item dd-item-static" href="javascript:void(0)" aria-disabled="true">
          <span>Lingua</span>
          <span class="right"><span class="dd-value">Italiano</span><span class="arrow">›</span></span>
        </a>
      </div>
    `;
  }

  // versione loggato
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  const labelName = fullName || user?.name || user?.username || user?.email || "Account";
  return `
    <div class="dd-head">
      <div class="dd-avatar">
        <img src="/img/avatar-default.png" alt="">
      </div>
      <div>
        <div class="dd-title">${escapeHtml(labelName)}</div>
        <div class="dd-sub">${escapeHtml(user?.email || "")}</div>
      </div>
      <button class="dd-close">✕</button>
    </div>

    <div class="dd-list">
      <a class="dd-item" href="profile.html">
        <span>Profilo</span><span class="right">›</span>
      </a>

      <a class="dd-item" href="my-ads.html">
        <span>I miei annunci</span><span class="right">›</span>
      </a>

      <a class="dd-item" href="messages.html">
        <span>Messaggi</span><span class="right">›</span>
      </a>

      <div class="dd-sep"></div>

      <a class="dd-item dd-item-static" href="javascript:void(0)" aria-disabled="true">
        <span>Paese</span>
        <span class="right"><span class="dd-value">Italia</span><span class="arrow">›</span></span>
      </a>

      <a class="dd-item dd-item-static" href="javascript:void(0)" aria-disabled="true">
        <span>Lingua</span>
        <span class="right"><span class="dd-value">Italiano</span><span class="arrow">›</span></span>
      </a>

      <div class="dd-sep"></div>

      <a class="dd-item" href="#" id="logoutBtn">
        <span>Esci</span><span class="right">›</span>
      </a>
    </div>
  `;
}


/** Inizializza topbar su tutte le pagine */
function uiInitTopbar() {
  const avatarBtn  = document.querySelector("#avatarBtn");
  const userLink   = document.querySelector("#userLink");
  const topMsg     = document.querySelector("#topMessagesLink");
  const dropdown   = document.querySelector("#userDropdown");
  const userAvatar = document.querySelector("#userAvatar");
  const publishCta = document.querySelector("#publishCta");

  if (!avatarBtn || !dropdown || !userAvatar || !userLink) return;


  // Link \"Messaggi\" in topbar: visibile solo se loggato
  if (topMsg) {
    topMsg.style.display = CORE.isLogged() ? "inline-flex" : "none";
  }

  // CTA "Pubblica annunci": se non loggato -> login
  if (publishCta) {
    publishCta.addEventListener("click", (e) => {
      if (!CORE.isLogged()) {
        e.preventDefault();
        window.location.href = "login.html";
      }
    });
  }

  const defaultAvatar = userAvatar.getAttribute("src") || "/img/avatar-default.png";

  // Avatar: se presente in localStorage (register) usalo
  const storedPhoto = localStorage.getItem("profilePhoto");
  const avatarSrc = storedPhoto || defaultAvatar;
  userAvatar.src = avatarSrc;

  // Link testuale: "Accedi" (sempre link a login se non loggato)
  if (!CORE.isLogged()) {
    userLink.textContent = "Accedi";
    userLink.href = "login.html";
  } else {
    const u = CORE.getUser() || {};
    const first = u.first_name || u.firstname || u.name || "Account";
    const last  = u.last_name || u.lastname || "";
    const label = `${first}${last ? " " + last : ""}`.trim();
    userLink.textContent = label;
    userLink.href = "profile.html";
  }

  // Inietta HTML dropdown
  dropdown.innerHTML = buildDropdownHTML(CORE.isLogged(), CORE.getUser(), avatarSrc);

  // Se non loggato: i link che richiedono auth rimandano al login mantenendo "next"
  if (!CORE.isLogged()) {
    dropdown.querySelectorAll("a[data-requires-auth]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const next = encodeURIComponent(a.getAttribute("href") || "homepage.html");
        window.location.href = "login.html?next=" + next;
      });
    });
  }

  function openDropdown() {
    dropdown.classList.add("open");
    avatarBtn.setAttribute("aria-expanded", "true");
  }
  function closeDropdown() {
    dropdown.classList.remove("open");
    avatarBtn.setAttribute("aria-expanded", "false");
  }
  function toggleDropdown() {
    dropdown.classList.contains("open") ? closeDropdown() : openDropdown();
  }

  avatarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });

  // Chiudi con click esterno / ESC
  document.addEventListener("click", (e) => {
    if (!dropdown.classList.contains("open")) return;
    if (!dropdown.contains(e.target) && e.target !== avatarBtn) closeDropdown();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });

  // Bottoni interni dropdown
  dropdown.addEventListener("click", (e) => {
    const target = e.target;
    // Chiudi
    if (target && target.closest && target.closest(".dd-close")) {
      e.preventDefault();
      closeDropdown();
      return;
    }
    // Logout
    const logout = target && target.closest ? target.closest("#logoutBtn") : null;
    if (logout) {
      e.preventDefault();
      CORE.logout();
      closeDropdown();
      window.location.href = "homepage.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  uiInitTopbar();
  uiInitPasswordToggles();
});function getDisplayName(u){
  if(!u) return "";
  return (u.name || u.username || u.fullname || u.full_name || u.nome || u.first_name || u.email || "").toString().trim();
}


