// Import delle classi (assumendo che siano caricate come script nell'HTML)

document.addEventListener("DOMContentLoaded", () => {
    // Controllo di autenticazione
    if (!CORE.isLogged()) {
        sessionStorage.setItem("fmr_after_login", window.location.href);
        window.location.href = "login.html";
        return;
    }

    /**
     * Bootstrapper per l'architettura MVP della pagina di pubblicazione annunci.
     * Inizializza Model, View e Presenter, delegando a quest'ultimo tutta la logica.
     * Questo file funge da semplice punto di ingresso.
     */
    const app = new AdPublishPresenter(
        new AdPublishModel(),
        new AdPublishView()
    );
});
