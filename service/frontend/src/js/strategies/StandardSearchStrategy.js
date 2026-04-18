/**
 * @class StandardSearchStrategy
 * @implements SearchStrategy
 * @description Strategia di ricerca "standard". Invia tutti i filtri così come sono.
 * @author FedeeSki (PRES) - Architetto del pattern
 */
class StandardSearchStrategy extends SearchStrategy {
    /**
     * @override
     */
    buildQuery(criteria) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(criteria)) {
            if (value) {
                queryParams.append(key, value);
            }
        }
        // Assicura che il backend sappia quale strategia è stata usata
        queryParams.set("strategy", "standard");
        return queryParams;
    }
}
