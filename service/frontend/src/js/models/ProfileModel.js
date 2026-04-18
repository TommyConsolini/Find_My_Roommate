/**
 * @class ProfileModel
 * @description Gestisce la comunicazione con le API REST per i dati del profilo.
 * @author FedeeSki (PRES)
 */
class ProfileModel {
    /**
     * @method fetchProfile
     * @description Recupera i dati del profilo dal backend.
     * @returns {Promise<Object>} Dati profilo e utente.
     */
    async fetchProfile() {
        return await CORE.apiFetch("/profile", { auth: true });
    }

    /**
     * @method updateProfile
     * @description Invia i dati aggiornati del profilo al backend.
     * @param {Object} payload - Dati da salvare (birth_date, gender, bio, etc).
     * @returns {Promise<Object>} Risposta del server.
     */
    async updateProfile(payload) {
        return await CORE.apiFetch("/profile", {
            method: "PUT",
            body: payload,
            auth: true
        });
    }

    /**
     * @method getLocalUser
     * @description Recupera l'utente corrente dalla sessione locale.
     * @returns {Object} Oggetto User.
     */
    getLocalUser() {
        return CORE.getUser() || {};
    }

    /**
     * @method getLocalExtras
     * @description Recupera dati extra (es. telefono) dalla sessione locale.
     * @returns {Object}
     */
    getLocalExtras() {
        return CORE.getExtras?.() || {};
    }

    /**
     * @method updateLocalSession
     * @description Aggiorna i dati utente nella sessione locale.
     * @param {Object} user - Nuovi dati utente.
     */
    updateLocalSession(user) {
        CORE.saveSession(CORE.getToken(), user);
    }
}
