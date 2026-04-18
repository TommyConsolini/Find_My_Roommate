/**
 * @class SearchModel
 * @description Gestisce la comunicazione con l'API di ricerca.
 * Riceve i parametri di query già formattati dal Presenter (che ha usato una Strategy).
 * @author FedeeSki (PRES)
 */
class SearchModel {
    /**
     * @method findAds
     * @param {URLSearchParams} queryParams - Oggetto URLSearchParams già costruito dalla strategia.
     * @returns {Promise<Array>} Un array di annunci dal backend.
     */
    async findAds(queryParams) {
        const endpoint = `/search?${queryParams.toString()}`;
        return await CORE.apiFetch(endpoint, { auth: true });
    }
}
