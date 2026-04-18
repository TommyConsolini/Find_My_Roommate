document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    try {
      const res = await CORE.apiFetch("/login", {
        method: "POST",
        body: { email, password },
        auth: false
      });

      // Backend ritorna: { token, user }
      if (!res || !res.token) {
        throw new Error("Risposta login non valida (token mancante)." + (res?.raw ? "\n" + res.raw : ""));
      }
      CORE.saveSession(res.token, res.user || {});

      uiToast("Login OK", "Bentornato!");
      const next = sessionStorage.getItem("fmr_after_login");
      if (next) {
        sessionStorage.removeItem("fmr_after_login");
        window.location.href = next;
      } else {
        window.location.href = "homepage.html";
      }
    } catch (err) {
      uiToast("Login fallito", err.message);
    }
  });
});
