// Import delle classi (assumendo che siano caricate come script nell'HTML)

document.addEventListener("DOMContentLoaded", () => {
    /**
     * Bootstrapper per l'architettura MVP della Homepage.
     * Inizializza Model, View e Presenter per la funzionalità di ricerca.
     */
    const app = new SearchPresenter(
        new SearchModel(),
        new SearchView()
    );

    // Eseguiamo una ricerca iniziale per popolare la pagina con annunci generici.
    app.executeSearch({});
});
