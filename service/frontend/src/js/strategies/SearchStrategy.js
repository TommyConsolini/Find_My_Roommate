/**
 * @interface SearchStrategy
 * @description Interfaccia (contratto) per diverse strategie di costruzione della query di ricerca.
 * Definisce il metodo che ogni strategia concreta deve implementare.
 * @author FedeeSki (PRES) - Architetto del pattern
 */
class SearchStrategy {
    /**
     * @param {Object} criteria - I filtri grezzi provenienti dalla View.
     * @returns {URLSearchParams} I parametri pronti per la richiesta API.
     * @throws {Error} Se non implementato dalla sottoclasse.
     */
    buildQuery(criteria) {
        throw new Error("Il metodo 'buildQuery' deve essere implementato da una strategia concreta.");
    }
}
