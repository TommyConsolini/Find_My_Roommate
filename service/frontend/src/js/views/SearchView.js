/**
 * @class SearchView
 * @description Gestisce l'interfaccia utente (Passive View). Usa il pattern Observer
 * per notificare il Presenter degli eventi UI tramite oggetti Subject.
 * @author FedeeSki (PRES) - Architetto della View
 */
class SearchView {
    constructor() {
        // Elementi del DOM
        this.resultsContainer = document.getElementById("results");
        this.resultsTitle = document.getElementById("resultsTitle");
        this.searchButton = document.getElementById("btnSearch");
        this.cityInput = document.getElementById("city");
        this.strategySelect = document.getElementById("strategy");
        this.applyFiltersButton = document.getElementById("filtersApply");
        this.filtersButton = document.getElementById("btnFilters");
        this.resetFiltersButton = document.getElementById("filtersReset");
        this.filtersPopover = document.getElementById("filtersPopover");
        this.closeFiltersButton = document.getElementById("filtersClose");
        this.filterForm = document.querySelector("#filtersPopover .fp-grid");
        this.filterChips = document.querySelector("#filtersPopover .fp-chips");

        // --- Pattern Observer: Subjects per gli eventi UI ---
        this.searchClicked = new Subject();
        this.applyFiltersClicked = new Subject();
        this.filtersToggled = new Subject();
        this.filtersReset = new Subject();
        
        // Collega gli eventi del DOM alla notifica degli observers
        this.searchButton?.addEventListener("click", () => this.searchClicked.notify());
        this.applyFiltersButton?.addEventListener("click", () => this.applyFiltersClicked.notify());
        this.filtersButton?.addEventListener("click", (e) => { e.stopPropagation(); this.filtersToggled.notify(); });
        this.resetFiltersButton?.addEventListener("click", () => {
            this.resetFilterInputs();
            this.filtersReset.notify();
        });
        this.closeFiltersButton?.addEventListener("click", () => this.filtersToggled.notify(false)); // Notifica con payload
    }

    // --- Metodi per l'iscrizione (usati dal Presenter/Observer) ---
    
    bindSearch(handler) { this.searchClicked.subscribe(handler); }
    bindApplyFilters(handler) { this.applyFiltersClicked.subscribe(handler); }
    bindToggleFilters(handler) { this.filtersToggled.subscribe(handler); }
    bindResetFilters(handler) { this.filtersReset.subscribe(handler); }

    // --- Metodi getter e di manipolazione del DOM (chiamati dal Presenter) ---

    getSearchCriteria() {
        const criteria = {};
        if (this.filterForm) {
            new FormData(this.filterForm).forEach((value, key) => {
                if (value) criteria[key] = value;
            });
        }
        if (this.filterChips) {
            this.filterChips.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
                criteria[input.id] = 'true';
            });
        }
        if (this.cityInput.value) criteria.city = this.cityInput.value;
        if (this.strategySelect.value) criteria.strategy = this.strategySelect.value;
        return criteria;
    }

    renderResults(ads) {
        this.resultsTitle.style.display = 'block';
        if (!ads || ads.length === 0) {
            this.resultsContainer.innerHTML = `<div class="card" style="padding:14px; text-align:center;">Nessun annuncio corrisponde alla tua ricerca.</div>`;
            return;
        }
        this.resultsContainer.innerHTML = ads.map(this._createCardHTML).join('');
    }
    
    setLoading(isLoading) {
        this.resultsTitle.style.display = 'block';
        this.resultsContainer.innerHTML = isLoading 
            ? `<div class="card" style="padding:14px; text-align:center;">Ricerca in corso...</div>`
            : '';
    }

    toggleFiltersPopover(show) {
        this.filtersPopover.classList.toggle('hidden', !show);
    }
    
    resetFilterInputs() {
        this.filterForm?.querySelectorAll('input, select').forEach(el => el.value = '');
        this.filterChips?.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    }

    _createCardHTML(ad) {
        const scoreBadge = ad.score !== undefined ? `<span class="badge compat">Compatibilità ${ad.score}%</span>` : '';
        const defaultImage = '../img/ad' + (Math.floor(Math.random() * 6) + 1) + '.jpg';
        return `
            <article class="ad-card" onclick="window.location.href='ad.html?id=${ad.id}'" role="link" tabindex="0">
                <img class="ad-thumb" src="${ad.cover_image || defaultImage}" alt="Foto annuncio: ${ad.title}" />
                <div class.ad-body">
                    <div class="ad-top">
                        <div class="ad-price">€ ${ad.price || 0} / mese</div>
                        ${scoreBadge}
                    </div>
                    <div class="ad-title">${ad.title || "Annuncio"}</div>
                    <div class="ad-meta"><span>${ad.city || "Città"}</span></div>
                </div>
            </article>
        `;
    }
}
