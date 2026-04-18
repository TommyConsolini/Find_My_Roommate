/**
 * @class StrictSearchStrategy
 * @implements SearchStrategy
 * @description Strategia di ricerca "strict". Potrebbe aggiungere parametri specifici
 * per richiedere al backend un matching più rigoroso.
 * @author FedeeSki (PRES) - Architetto del pattern
 */
class StrictSearchStrategy extends SearchStrategy {
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
        // Logica specifica della strategia "strict"
        queryParams.set("strict_mode", "true");
        queryParams.set("strategy", "strict");
        return queryParams;
    }
}
