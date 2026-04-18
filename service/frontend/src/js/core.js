const CORE = (() => {
  const stored = localStorage.getItem("fmr_api_base");
  const API_BASE = stored || `${window.location.origin}/api`;

  // Sessione
  const LS_TOKEN  = "fmr_token";
  const LS_USER   = "fmr_user";   // JSON con user restituito dal backend

  // Extra lato client (per non rompere le API esistenti)
  const LS_EXTRAS = "fmr_extras";

  function getToken() {
    return localStorage.getItem(LS_TOKEN);
  }

  function getUser() {
    const raw = localStorage.getItem(LS_USER);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }

  function isLogged() {
    return !!getToken();
  }

  function saveSession(token, user) {
    localStorage.setItem(LS_TOKEN, token);
    localStorage.setItem(LS_USER, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_EXTRAS);
  }

  function getExtras() {
    const raw = localStorage.getItem(LS_EXTRAS);
    try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  }

  function saveExtras(partial) {
    const cur = getExtras();
    const next = { ...cur, ...partial };
    localStorage.setItem(LS_EXTRAS, JSON.stringify(next));
  }

  // Wrapper standard per chiamate API (robusto anche se la risposta non è JSON)
  async function apiFetch(path, { method="GET", body=null, auth=false } = {}) {
    const headers = {};

    if (body !== null) headers["Content-Type"] = "application/json";

    if (auth) {
      const token = getToken();
      if (!token) throw new Error("Devi essere loggato per questa operazione.");
      headers["Authorization"] = "Bearer " + token;
    }

    let res;
    try {
      res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    } catch (e) {
      throw new Error("Impossibile contattare il backend. Controlla che Docker sia avviato e che il backend risponda su " + API_BASE);
    }

    // Leggiamo sempre testo -> poi proviamo a fare JSON.parse
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = null; }

    if (!res.ok) {
      const msg = data?.message || data?.error || text || ("Errore HTTP " + res.status);
      throw new Error(msg);
    }

    // Se OK ma non JSON, ritorna comunque un oggetto
    return data ?? { raw: text };
  }

  // Helper comodi
  function apiGet(path, opts={}) { return apiFetch(path, { ...opts, method:"GET"  }); }
  function apiPost(path, body, opts={}) { return apiFetch(path, { ...opts, method:"POST", body }); }
  function apiPut(path, body, opts={}) { return apiFetch(path, { ...opts, method:"PUT", body }); }
  function apiDel(path, opts={}) { return apiFetch(path, { ...opts, method:"DELETE" }); }

  function logout(){ clearSession(); }

  return {
    API_BASE,
    getToken,
    getUser,
    isLogged,
    saveSession,
    clearSession,
    getExtras,
    saveExtras,
    apiFetch,
    apiGet,
    apiPost,
    apiPut,
    apiDel,
    logout
  };
})();
