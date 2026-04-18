function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("Impossibile leggere il file."));
    r.readAsDataURL(file);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const first_name = document.querySelector("#firstName").value.trim();
    const last_name  = document.querySelector("#lastName").value.trim();
    const email      = document.querySelector("#email").value.trim();
    const password   = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#passwordConfirm")?.value ?? "";

    if (password !== passwordConfirm) {
      toast("Le password non coincidono", "error");
      return;
    }

    const phoneEl = document.querySelector("#phone");
    const phone = phoneEl ? phoneEl.value.trim() : "";

    const photoEl = document.querySelector("#photo");
    const photoFile = photoEl?.files?.[0] || null;

    try {
      // 1) Registrazione backend
      await CORE.apiFetch("/register", {
        method: "POST",
        body: { first_name, last_name, email, password },
        auth: false
      });

      // 2) Extra lato client (telefono + foto)
      const extras = {};
      if (phone) extras.phone = phone;
      if (photoFile) {
        const dataUrl = await readFileAsDataURL(photoFile);
        extras.photo = dataUrl;
      }
      if (Object.keys(extras).length) {
        CORE.saveExtras(extras);
      }

      uiToast("Registrazione OK", "Ora puoi fare login.");
      window.location.href = "login.html";
    } catch (err) {
      uiToast("Registrazione fallita", err.message);
    }
  });
});
