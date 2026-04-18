/**
 * @class SearchPresenter
 * @description Orchestra la ricerca. Agisce come "Observer" per la View e usa il
 * pattern "Strategy" per decidere come costruire la query di ricerca.
 * @author FedeeSki (PRES)
 */
class SearchPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.isFiltersPopoverOpen = false;

        // --- Pattern Observer: il Presenter si iscrive agli eventi della View ---
        this.view.bindSearch(() => this.executeSearch());
        this.view.bindApplyFilters(() => {
            this.toggleFilters(false);
            this.executeSearch();
        });
        this.view.bindToggleFilters((forceState) => this.toggleFilters(forceState));
        this.view.bindResetFilters(() => this.executeSearch());
        
        // --- Pattern Strategy: mappatura delle strategie di ricerca disponibili ---
        this.strategies = {
            standard: new StandardSearchStrategy(),
            strict: new StrictSearchStrategy(),
        };
    }

    /**
     * @method executeSearch
     * @description Orchesta il processo di ricerca.
     */
    async executeSearch() {
        this.view.setLoading(true);
        const criteria = this.view.getSearchCriteria();
        try {
            // --- Pattern Strategy: selezione e uso della strategia ---
            const strategyKey = criteria.strategy || 'standard';
            const strategy = this.strategies[strategyKey];
            if (!strategy) throw new Error(`Strategia '${strategyKey}' non trovata.`);

            const queryParams = strategy.buildQuery(criteria);
            
            const ads = await this.model.findAds(queryParams);
            this.view.renderResults(ads);
        } catch (error) {
            uiToast("Errore di Ricerca", error.message);
            this.view.renderResults([]);
        }
    }

    /**
     * @method toggleFilters
     * @description Gestisce la visibilità del popover dei filtri.
     */
    toggleFilters(forceState) {
        this.isFiltersPopoverOpen = (forceState !== undefined) ? forceState : !this.isFiltersPopoverOpen;
        this.view.toggleFiltersPopover(this.isFiltersPopoverOpen);
    }
}
