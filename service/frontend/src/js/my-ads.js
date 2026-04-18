/* ==========================================================================
   my-ads.js
   - Lista "I miei annunci" (simulazione lato frontend)
   - I dati vengono salvati in localStorage quando pubblichi un annuncio.
   ========================================================================== */

const FMR_MY_ADS = "fmr_my_ads_v1";

function loadMyAds(){
  try { return JSON.parse(localStorage.getItem(FMR_MY_ADS) || "[]"); }
  catch { return []; }
}
function saveMyAds(list){
  localStorage.setItem(FMR_MY_ADS, JSON.stringify(list || []));
}

function getUserKey(){
  const u = CORE.getUser() || {};
  return String(u.id || u.email || u.username || "anon");
}

function deleteMyAd(ad){
  const all = loadMyAds();
  const userKey = getUserKey();
  const id = ad?.id;

  const next = all.filter(x => {
    const sameOwner = String(x.ownerKey || "") === String(userKey);
    const sameId = String(x.id || "") === String(id || "");
    // rimuovi solo l'annuncio dell'utente corrente
    return !(sameOwner && sameId);
  });

  saveMyAds(next);
  // ricarica la lista
  init();
}



function requireLogin(){
  if (!CORE.isLogged()) {
    const next = encodeURIComponent("my-ads.html");
    window.location.href = "login.html?next=" + next;
    return false;
  }
  return true;
}


function formatPrice(n){
  const num = Number(n || 0);
  try {
    return num.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  } catch {
    return "€ " + Math.round(num);
  }
}

function esc(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* ==========================================================================
   Rendering (stesso layout/card della homepage "Annunci in evidenza")
   - Manteniamo la stessa struttura .ad-card/.ad-thumb/.ad-body per riusare CSS
   - Aggiungiamo un pulsante "Elimina" overlay senza rovinare la disposizione
   ========================================================================== */
function render(list){
  const wrap = document.getElementById("myAdsList");
  const empty = document.getElementById("myAdsEmpty");
  wrap.innerHTML = "";

  if (!list.length){
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach((ad) => {
    const price = (ad.price ?? 0);
    const city  = ad.city || "";
    const title = ad.title || "Annuncio";
    const meta  = ad.meta || ad.address || ""; // piccolo fallback
    const img   = ad.cover || ad.img || "/img/default-room.jpg";
    const mid   = ad.mid || ad.id || "";

    // Stesso markup della homepage (featured)
    const card = document.createElement("article");
    card.className = "ad-card myad-card";
    card.setAttribute("role","link");
    card.tabIndex = 0;

    // Navigazione al dettaglio (se presente)
    const href = mid ? `ad.html?mid=${encodeURIComponent(mid)}` : null;
    if (href){
      card.addEventListener("click", () => window.location.href = href);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") window.location.href = href;
      });
    }

    card.innerHTML = `
      <img class="ad-thumb" src="${esc(img)}" alt="Foto annuncio" />
      <div class="ad-body">
        <div class="ad-top">
          <div class="ad-price">${esc(formatPrice(price))}</div>
        </div>

        <div class="ad-title">${esc(title)}</div>

        <div class="ad-meta">
          <span>${esc(city)}</span>
          ${meta ? `<span>•</span><span>${esc(meta)}</span>` : ``}
        </div>
      </div>

      <button class="myad-del" type="button" title="Elimina annuncio" aria-label="Elimina annuncio">🗑</button>
    `;

    // Elimina (simulazione: rimuove dal localStorage)
    const delBtn = card.querySelector(".myad-del");
    delBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!confirm("Vuoi eliminare questo annuncio?")) return;
      deleteMyAd(ad);
    });

    wrap.appendChild(card);
  });
}


function init(){
  if (!requireLogin()) return;
  const all = loadMyAds();
  const key = getUserKey();
  const mine = all.filter(x => String(x.ownerKey) === key);
  render(mine);
}

document.addEventListener("DOMContentLoaded", init);
