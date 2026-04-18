function q(name){ return new URLSearchParams(window.location.search).get(name); }

// Helpers locali
function escapeHtml(str) {
  return (str ?? "").toString()
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Extra (caratteristiche + foto) salvate dal frontend (ads.js)
const FMR_AD_EXTRAS = "fmr_ad_extras_v1";
function loadAdExtrasMap(){
  try { return JSON.parse(localStorage.getItem(FMR_AD_EXTRAS) || "{}"); } catch { return {}; }
}
function extrasKeyForAd(ad){
  if (ad?.id) return "id:" + ad.id;
  return "k:" + [ad?.title, ad?.city, ad?.address, ad?.price].map(v => String(v ?? "")).join("|");
}
function applyExtras(ad){
  const map = loadAdExtrasMap();
  const ex = map[extrasKeyForAd(ad)];
  if (!ex) return ad;

  if (Number.isFinite(ex.surface)) ad.surface = ex.surface;
  if (Number.isFinite(ex.rooms)) ad.rooms = ex.rooms;
  if (Number.isFinite(ex.baths)) ad.baths = ex.baths;
  if (typeof ex.floor === "string" && ex.floor.trim()) ad.floorTxt = `Piano ${ex.floor.trim()}`;

  if (typeof ex.features?.elevator === "boolean") ad.elevator = ex.features.elevator;
  if (typeof ex.features?.smoker === "boolean") ad.smoker = ex.features.smoker;
  if (typeof ex.features?.pets === "boolean") ad.pets = ex.features.pets;

  if (Array.isArray(ex.photos) && ex.photos.length) {
    ad.images = ex.photos;
    ad.img = ex.photos[0];
  }
  return ad;
}
function formatPrice(value){
  const n = Number(value || 0);
  try { return n.toLocaleString("it-IT", { style:"currency", currency:"EUR", maximumFractionDigits: 0 }); }
  catch { return `${n} €`; }
}
function toast(msg){
  if (typeof uiToast === "function") uiToast("Info", msg);
  else console.log(msg);
}

const MOCK_ADS = [
  { mid:"m1", title:"Stanza singola luminosa in centro", city:"Parma", address:"Via Repubblica 12, Centro", price:420, surface:70, rooms:3, baths:2, floorTxt:"Piano 2", elevator:true, smoker:false, pets:true, img:"../img/ad1.jpg",
    description:"Appartamento condiviso vicino al centro: stanza singola, spese contenute, ambiente tranquillo. Perfetta per studenti e giovani lavoratori.",
    extras:["Balcone","Ascensore","Climatizzazione","Arredato"],
  },
  { mid:"m2", title:"Posto letto in doppia, zona università", city:"Bologna", address:"Via Zamboni 8, Università", price:280, surface:90, rooms:4, baths:1, floorTxt:"Piano terra", elevator:false, smoker:true, pets:false, img:"../img/ad2.jpg",
    description:"Posto letto in doppia in appartamento ampio, vicino all'università. Zona servita, ideale per studenti.",
    extras:["Giardino","Balcone","Wi‑Fi"],
  },
  { mid:"m3", title:"Stanza matrimoniale con bagno privato", city:"Milano", address:"Viale Monza 90, NoLo", price:650, surface:110, rooms:4, baths:2, floorTxt:"Piano 5", elevator:true, img:"../img/ad3.jpg",
    description:"Stanza matrimoniale con bagno privato. Appartamento moderno, vicino metro, spazi comuni curati.",
    extras:["Terrazzo","Ascensore","Climatizzazione","Box/posto auto"],
  },
  { mid:"m4", title:"Stanza singola, appartamento moderno", city:"Torino", address:"Corso Francia 22, Parella", price:390, surface:80, rooms:3, baths:1, floorTxt:"Piano 3", elevator:true, img:"../img/ad4.jpg",
    description:"Appartamento moderno e luminoso. Stanza singola, cucina attrezzata, zona tranquilla e ben collegata.",
    extras:["Balcone","Ascensore","Arredato"],
  },
  { mid:"m5", title:"Monolocale condivisibile (2 posti)", city:"Roma", address:"Via Tiburtina 310, San Lorenzo", price:520, surface:45, rooms:1, baths:1, floorTxt:"Ultimo piano", elevator:false, img:"../img/ad5.jpg",
    description:"Monolocale vicino a San Lorenzo, adatto a due persone. Ottimo per studenti, servizi e mezzi sotto casa.",
    extras:["Climatizzazione","Balcone"],
  },
  { mid:"m6", title:"Stanza singola con terrazzo", city:"Firenze", address:"Via Gioberti 5, Campo di Marte", price:480, surface:95, rooms:4, baths:2, floorTxt:"Piano 1", elevator:false, img:"../img/ad6.jpg",
    description:"Stanza singola in appartamento ampio con terrazzo. Vicino a supermercati e fermate bus.",
    extras:["Terrazzo","Giardino","Wi‑Fi"],
  },
];

function buildGallery(mainImg){
  const all = ["../img/ad1.jpg","../img/ad2.jpg","../img/ad3.jpg","../img/ad4.jpg","../img/ad5.jpg","../img/ad6.jpg"];
  const uniq = [mainImg, ...all.filter(x => x !== mainImg)].slice(0,4);
  return [
    {src: uniq[0], label:"Foto"},
    {src: uniq[1], label:"Salone"},
    {src: uniq[2], label:"Camera"},
    {src: uniq[3], label:"+ altre foto"},
  ];
}

function render(ad){
  const page = document.querySelector("#adPage");
  if (!page) return;

  const gallery = buildGallery(ad.img);
  const planimetry = "../img/ad5.jpg";

  page.innerHTML = `
    <section>
      <div class="breadcrumb">
        <a href="homepage.html">‹ Lista annunci</a>
      </div>

      <div class="head-row">
        <div>
          <h1 class="ad-title">${escapeHtml(ad.title)}</h1>
          <div class="ad-sub">${escapeHtml(ad.city)} • ${escapeHtml(ad.address || "")}</div>
        </div>
        <div class="ad-price">${escapeHtml(formatPrice(ad.price))} <span style="color:var(--muted);font-weight:800">/mese</span></div>
      </div>

      <div class="gallery">
        <div class="main-photo">
          <img id="mainImg" src="${gallery[0].src}" alt="Foto annuncio">
        </div>
        <div class="thumbs" id="thumbs">
          ${gallery.slice(1).map(g => `
            <div class="thumb" data-src="${g.src}">
              <img src="${g.src}" alt="${escapeHtml(g.label)}">
              <div class="label">${escapeHtml(g.label)}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="specs-row">
        <div class="spec"><strong>${ad.rooms ?? "-"} </strong><span>locali</span></div>
        <div class="spec"><strong>${ad.surface ?? "-"} </strong><span>m²</span></div>
        <div class="spec"><strong>${ad.baths ?? "-"} </strong><span>bagni</span></div>
        <div class="spec"><strong>${escapeHtml(ad.floorTxt ?? "-")}</strong></div>
        <div class="spec"><strong>${ad.elevator ? "Ascensore" : "No ascensore"}</strong></div>
      </div>

      <nav class="tabs" aria-label="Sezioni annuncio">
        <a class="tab active" href="#desc">Descrizione</a>
        <a class="tab" href="#car">Caratteristiche</a>
        <a class="tab" href="#plan">Planimetria</a>
        <a class="tab" href="#map">Mappa</a>
      </nav>

      <div id="desc" class="section">
        <h2>Descrizione</h2>
        <p class="p">${escapeHtml(ad.description || "")}</p>
      </div>

      <div id="car" class="section">
        <h2>Caratteristiche</h2>
        <div class="features">
          <div class="frow"><div class="fkey">Tipologia</div><div class="fval">Stanza in appartamento condiviso</div></div>
          <div class="frow"><div class="fkey">Contratto</div><div class="fval">Affitto</div></div>
          <div class="frow"><div class="fkey">Locali</div><div class="fval">${ad.rooms ?? "-"}</div></div>
          <div class="frow"><div class="fkey">Bagni</div><div class="fval">${ad.baths ?? "-"}</div></div>
          <div class="frow"><div class="fkey">Superficie</div><div class="fval">${ad.surface ?? "-"} m²</div></div>
          <div class="frow"><div class="fkey">Piano</div><div class="fval">${escapeHtml(ad.floorTxt ?? "-")}</div></div>
          <div class="frow"><div class="fkey">Ascensore</div><div class="fval">${ad.elevator ? "Sì" : "No"}</div></div>
          <div class="frow"><div class="fkey">Fumatori</div><div class="fval">${ad.smoker ? "Sì" : "No"}</div></div>
          <div class="frow"><div class="fkey">Animali domestici</div><div class="fval">${ad.pets ? "Sì" : "No"}</div></div>
          <div class="frow"><div class="fkey">Extra</div><div class="fval">${escapeHtml((ad.extras||[]).join(", ") || "-")}</div></div>
        </div>
      </div>

      <div id="plan" class="section">
        <h2>Planimetria</h2>
        <div class="plan-box">
          <img src="${planimetry}" alt="Planimetria (demo)">
        </div>
      </div>

      <div id="map" class="section">
        <h2>Mappa</h2>
        <div class="map-box">Mappa (demo) • In una versione completa qui potresti integrare OpenStreetMap</div>
      </div>
    </section>

    <aside class="side">
      <div class="contact-card">
        <div class="cc-head">Contatta l'inserzionista</div>
        <div class="cc-body">
          <select id="reason">
            <option>Richiedere maggiori informazioni</option>
            <option>Verificare disponibilità</option>
            <option>Proporre prezzo</option>
          </select>

          <textarea id="msg" placeholder="Mi interessa questo annuncio, vorrei avere maggiori informazioni"></textarea>

          <div class="cc-actions">
            <button id="btnSend" class="btn btn-accent" type="button">Invia messaggio</button>
            <button id="btnVisit" class="btn btn-ghost" type="button">Richiedi visita</button>
            <button id="btnOffer" class="btn btn-ghost" type="button">Proponi prezzo</button>
          </div>
        </div>

        <div class="agent">
          <div class="pic">👤</div>
          <div>
            <div class="name">${escapeHtml(ad.ownerName || "Inserzionista")}</div>
            <div class="muted">Risponde di solito entro 2 ore</div>
          </div>
        </div>
      </div>
    </aside>
  `;

  // gallery thumbs -> swap main img
  const main = document.querySelector("#mainImg");
  document.querySelectorAll(".thumb").forEach(t => {
    t.addEventListener("click", () => { main && (main.src = t.dataset.src); });
  });

  // tabs active state
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const sections = tabs
    .map(t => document.querySelector(t.getAttribute("href")))
    .filter(Boolean);

  // Smooth scroll con offset (topbar + tabs sticky)
  function scrollToSection(el){
    const topbar = document.querySelector(".topbar");
    const tabsEl = document.querySelector(".tabs");
    const offset = (topbar?.offsetHeight || 0) + (tabsEl?.offsetHeight || 0) + 18;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  function setActiveById(id){
    tabs.forEach(t => t.classList.toggle("active", t.getAttribute("href") === `#${id}`));
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const sel = tab.getAttribute("href");
      const target = sel ? document.querySelector(sel) : null;
      if (target) scrollToSection(target);
      if (sel && sel.startsWith("#")) setActiveById(sel.slice(1));
      history.replaceState(null, "", sel || "");
    });
  });

  // Scroll-spy: aggiorna la tab attiva mentre scorri
  if ("IntersectionObserver" in window && sections.length){
    const topbar = document.querySelector(".topbar");
    const tabsEl = document.querySelector(".tabs");
    const offset = (topbar?.offsetHeight || 0) + (tabsEl?.offsetHeight || 0) + 24;
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveById(visible.target.id);
    }, { root: null, rootMargin: `-${offset}px 0px -65% 0px`, threshold: [0.1, 0.2, 0.35, 0.5] });
    sections.forEach(s => io.observe(s));
  }

  // invia messaggio -> vai alla chat (messages.html) e passa info via sessionStorage
  document.querySelector("#btnSend")?.addEventListener("click", () => {
    // Richiedi login per contattare
    if (!CORE.isLogged()) {
      sessionStorage.setItem("fmr_after_login", "messages.html");
      sessionStorage.setItem("chatDraft", JSON.stringify({
        to: ad.ownerName || "Inserzionista",
        text: (document.querySelector("#msg")?.value || "").trim(),
        adTitle: ad.title
      }));
      window.location.href = "login.html";
      return;
    }

    sessionStorage.setItem("chatDraft", JSON.stringify({
      to: ad.ownerName || "Inserzionista",
      text: (document.querySelector("#msg")?.value || "").trim(),
      adTitle: ad.title
    }));
    window.location.href = "messages.html";
  });

  document.querySelector("#btnVisit")?.addEventListener("click", () => toast("Richiesta visita inviata (demo)."));
  document.querySelector("#btnOffer")?.addEventListener("click", () => toast("Proposta inviata (demo)."));
}

async function loadFromBackend(id){
  // best-effort: se backend non raggiungibile, torna null
  try{
    const res = await CORE.apiGet(`/ads/${encodeURIComponent(id)}`);
    return res;
  }catch(e){
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
  const mid = q("mid");
  const id  = q("id");

  let ad = null;

  if (mid){
    ad = MOCK_ADS.find(a => a.mid === mid) || MOCK_ADS[0];
  } else if (id){
    const backend = await loadFromBackend(id);
    if (backend){
      ad = {
        title: backend.title || backend.name || "Annuncio",
        city: backend.city || backend.location || "—",
        address: backend.address || "",
        price: backend.price || backend.rent || 0,
        surface: backend.surface || backend.sqm || 0,
        rooms: backend.rooms || backend.locals || 0,
        baths: backend.baths || backend.bathrooms || 0,
        floorTxt: backend.floor ? `Piano ${backend.floor}` : "—",
        elevator: !!backend.elevator,
        smoker: !!(backend.smoker || backend.smoker_allowed || backend.fumatori),
        pets: !!(backend.pets || backend.pets_allowed || backend.animali),
        img: backend.img || "../img/ad1.jpg",
        description: backend.description || "",
        extras: backend.extras || [],
        ownerName: backend.owner || "Inserzionista",
      };
    } else {
      ad = MOCK_ADS[0];
      toast("Backend non raggiungibile: mostro un annuncio demo.");
    }
  } else {
    ad = MOCK_ADS[0];
  }

  render(applyExtras(ad));
  // Safety: se per qualche motivo il contenuto non viene renderizzato, mostra comunque un demo
  setTimeout(() => {
    const page = document.querySelector("#adPage");
    if (page && page.innerHTML.trim() === "") {
      render(applyExtras(MOCK_ADS[0]));
    }
  }, 50);
  } catch (e) {
    console.error(e);
    try { toast("Errore nel rendering annuncio: mostro un demo."); } catch {}
    render(applyExtras(MOCK_ADS[0]));
  }
});
