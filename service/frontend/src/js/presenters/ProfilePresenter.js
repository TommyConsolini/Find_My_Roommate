/**
 * @class ProfilePresenter
 * @description Orchestra la comunicazione tra ProfileModel e ProfileView per la pagina profilo.
 * Implementa la logica per il Task T3.4 (Popolamento dinamico form).
 * @author FedeeSki (PRES)
 */
class ProfilePresenter {
    /**
     * @param {ProfileModel} model 
     * @param {ProfileView} view 
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Associazione degli eventi della View ai metodi del Presenter
        this.view.bindTabClick((tab) => this.view.showTab(tab));
        this.view.bindSubmit(() => this.handleSave());
        
        // Avvio automatico della logica
        this.init();
    }

    /**
     * @method init
     * @description Eseguito all'avvio, imposta la tab di default e carica i dati.
     */
    async init() {
        this.view.showTab("contact");
        await this.loadInitialData();
    }

    /**
     * @method loadInitialData
     * @description Carica i dati dell'utente dal model e aggiorna la view.
     */
    async loadInitialData() {
        // Step 1: Carica dati locali (più veloce)
        const localUser = this.model.getLocalUser();
        this.updateUIWithUserData(localUser);

        // Step 2: Carica dati remoti e aggiorna UI
        try {
            this.view.setLoading(true);
            const remoteData = await this.model.fetchProfile();

            if (remoteData?.user) {
                this.model.updateLocalSession(remoteData.user);
                this.updateUIWithUserData(remoteData.user);
            }

            // Task T3.4: Popolamento dinamico del form con dati del profilo
            const profile = remoteData?.profile || remoteData || {};
            this.view.setProfileData(profile);

        } catch (e) {
            console.warn("Caricamento del profilo remoto fallito, la pagina funziona con dati locali.", e.message);
        } finally {
            this.view.setLoading(false);
        }
    }

    /**
     * @method updateUIWithUserData
     * @description Aggiorna le parti della UI non legate al form con i dati utente.
     * @param {Object} user 
     */
    updateUIWithUserData(user) {
        if (!user) return;
        const first = user.first_name || user.firstname || user.name || "";
        const last = user.last_name || user.lastname || user.surname || "";
        const fullName = `${first} ${last}`.trim();
        const initials = ((first.charAt(0) || "") + (last.charAt(0) || "")).toUpperCase() || "FM";
        
        const phone = this.model.getLocalExtras?.().phone || "";
        this.view.setHeaderInfo(fullName, initials, user.email, phone);
    }

    /**
     * @method handleSave
     * @description Gestisce l'evento di salvataggio del form.
     */
    async handleSave() {
        const payload = this.view.getFormData();
        try {
            this.view.setLoading(true);
            const response = await this.model.updateProfile(payload);
            uiToast("Profilo Aggiornato", response?.message || "Le modifiche sono state salvate.");
        } catch (err) {
            uiToast("Errore", err.message);
        } finally {
            this.view.setLoading(false);
        }
    }
}
