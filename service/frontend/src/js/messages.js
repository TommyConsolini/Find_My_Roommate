/* ==========================================================================
   messages.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Richiedi login per accedere ai messaggi
  if (!CORE.isLogged()) {
    sessionStorage.setItem("fmr_after_login", "messages.html");
    window.location.href = "login.html";
    return;
  }

  const chatListEl = document.querySelector("#chatList");
  const chatBodyEl = document.querySelector("#chatBody");
  const titleEl = document.querySelector("#chatTitle");
  const subEl = document.querySelector("#chatSub");
  const goAdEl = document.querySelector("#goAd");
  const form = document.querySelector("#chatForm");
  const msgInput = document.querySelector("#chatMsg");
  const search = document.querySelector("#chatSearch");

  if (!chatListEl || !chatBodyEl || !titleEl || !form) return;

  const DEMO_CHATS = [
    {
      id: "c1",
      ad: { id: "m1", title: "Stanza singola luminosa in centro", city: "Parma", price: 420, img: "../img/ad1.jpg" },
      lastAt: "18:31",
      messages: [
        { me: false, text: "Ciao! È ancora disponibile la stanza?", at: "18:08" },
        { me: true,  text: "Ciao 🙂 sì, disponibile da marzo. Preferisci visita o videochiamata?", at: "18:10" },
        { me: false, text: "Videochiamata va benissimo. Le spese sono incluse?", at: "18:12" },
        { me: true,  text: "Parzialmente: acqua e wifi inclusi, luce/gas in base ai consumi.", at: "18:14" }
      ]
    },
    {
      id: "c2",
      ad: { id: "m4", title: "Bilocale condiviso, ultimo piano con balcone", city: "Milano", price: 650, img: "../img/ad4.jpg" },
      lastAt: "17:24",
      messages: [
        { me: false, text: "Ciao, mi interessa l'annuncio. Che zona è?", at: "17:05" },
        { me: true,  text: "Zona Solari, a 5 minuti dalla metro.", at: "17:08" },
        { me: false, text: "Perfetto. Animali ammessi? Ho un gatto.", at: "17:10" },
        { me: true,  text: "Sì, animali ok 👍 purché abituati in casa.", at: "17:12" }
      ]
    }
  ];

  let chats = DEMO_CHATS.slice();
  let activeId = chats[0]?.id || null;

  function fmtAdLine(ad){
    const p = (ad.price != null) ? `${ad.price} €/mese` : "";
    return `${ad.city}${p ? " • " + p : ""}`;
  }

  function renderList() {
    const q = (search?.value || "").toLowerCase().trim();
    const filtered = chats.filter(c => {
      if(!q) return true;
      const t = `${c.ad.title} ${c.ad.city}`.toLowerCase();
      return t.includes(q);
    });

    chatListEl.innerHTML = filtered.map(c => {
      const active = c.id === activeId ? "active" : "";
      return `
        <div class="wa-item ${active}" role="listitem" data-id="${c.id}">
          <div class="wa-thumb"><img src="${c.ad.img}" alt=""></div>
          <div class="wa-item-main">
            <div class="wa-item-title">${escapeHtml(c.ad.title)}</div>
            <div class="wa-item-sub">${escapeHtml(fmtAdLine(c.ad))}</div>
          </div>
          <div class="wa-item-right">${escapeHtml(c.lastAt || "")}</div>
        </div>
      `;
    }).join("");

    chatListEl.querySelectorAll(".wa-item").forEach(el => {
      el.addEventListener("click", () => {
        activeId = el.getAttribute("data-id");
        renderList();
        renderChat();
      });
    });
  }

  function renderChat() {
    const c = chats.find(x => x.id === activeId);
    if (!c) {
      titleEl.textContent = "Seleziona una chat";
      subEl.textContent = "Clicca una conversazione a sinistra";
      chatBodyEl.innerHTML = "";
      goAdEl.href = "homepage.html";
      return;
    }

    titleEl.textContent = c.ad.title;
    subEl.textContent = fmtAdLine(c.ad);
    goAdEl.href = `ad.html?id=${encodeURIComponent(c.ad.id)}`;

    chatBodyEl.innerHTML = c.messages.map(m => `
      <div class="bubble ${m.me ? "me" : ""}">
        <div class="text">${escapeHtml(m.text)}</div>
        <div class="meta">${escapeHtml(m.at || "")}</div>
      </div>
    `).join("");

    chatBodyEl.scrollTop = chatBodyEl.scrollHeight;
  }

  function escapeHtml(str){
    return (str ?? "").toString()
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;");
  }

  // invio messaggio (demo)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = (msgInput.value || "").trim();
    if (!txt) return;

    const c = chats.find(x => x.id === activeId);
    if (!c) return;

    c.messages.push({ me: true, text: txt, at: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) });
    c.lastAt = c.messages[c.messages.length - 1].at;

    msgInput.value = "";
    renderList();
    renderChat();
  });

  search?.addEventListener("input", renderList);

  // init
  renderList();
  renderChat();
});
