/**
 * @class AdPublishModel
 * @description Gestisce la comunicazione con le API per la creazione di annunci.
 * @author FedeeSki (PRES)
 */
class AdPublishModel {
    /**
     * @method createAd
     * @description Invia i dati del nuovo annuncio al backend.
     * @param {FormData} formData - L'oggetto FormData contenente i dati del form,
     * incluse le immagini. L'uso di FormData è cruciale per l'upload di file.
     * @returns {Promise<Object>} La risposta del server.
     */
    async createAd(formData) {
        // Nota: Quando si usa FormData con fetch, non si imposta l'header 'Content-Type'.
        // Il browser lo imposta automaticamente a 'multipart/form-data' con il boundary corretto.
        return await CORE.apiFetch("/ads", { // Assumendo che l'endpoint sia /api/ads.php
            method: "POST",
            body: formData,
            // 'auth: true' viene gestito da CORE.apiFetch
        });
    }
}
