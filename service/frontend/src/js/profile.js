// Importa le classi (assumendo un sistema di moduli o script inclusi nell'HTML)
// Per ora, li carichiamo come script separati in profile.html
// import ProfileModel from './models/ProfileModel.js';
// import ProfileView from './views/ProfileView.js';
// import ProfilePresenter from './presenters/ProfilePresenter.js';

document.addEventListener("DOMContentLoaded", () => {
    // Controllo di autenticazione, essenziale per questa pagina
    if (!CORE.isLogged()) {
        sessionStorage.setItem("fmr_after_login", window.location.href);
        window.location.href = "login.html";
        return;
    }

    /**
     * Bootstrapper per l'architettura MVP della pagina Profilo.
     * Inizializza le tre componenti (Model, View, Presenter) e le collega.
     * Tutta la logica dell'applicazione è ora gestita dal Presenter.
     */
    const app = new ProfilePresenter(
        new ProfileModel(),
        new ProfileView()
    );
});
