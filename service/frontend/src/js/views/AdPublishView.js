/**
 * @class AdPublishView
 * @description Gestisce l'interfaccia utente per la pubblicazione di un annuncio.
 * È una "Passive View" che non contiene logica applicativa.
 * @author FedeeSki (PRES)
 */
class AdPublishView {
    constructor() {
        this.form = document.getElementById("publishForm");
        this.resetBtn = document.getElementById("resetBtn");
        
        // Elementi per l'anteprima live
        this.adPreview = document.getElementById("adPreview");
        this.previewTitle = this.adPreview?.querySelector(".ad-preview-title");
        this.previewMeta = this.adPreview?.querySelector(".ad-preview-meta");
        this.previewPrice = this.adPreview?.querySelector(".ad-preview-price");
        this.previewChips = this.adPreview?.querySelectorAll(".ad-preview-chips .mini");
        this.previewImage = this.adPreview?.querySelector(".ad-preview-img");

        // Elementi per l'upload delle foto
        this.photoInput = document.getElementById("photos");
        this.photoPreviewContainer = document.getElementById("photoPreview");
    }

    // --- Metodi per notificare il Presenter (Input) ---

    bindSubmit(handler) {
        this.form?.addEventListener("submit", (e) => {
            e.preventDefault();
            handler();
        });
    }

    bindFormChange(handler) {
        this.form?.addEventListener("input", () => handler(this.getLiveFormData()));
    }
    
    bindPhotoChange(handler) {
        this.photoInput?.addEventListener("change", (e) => handler(e.target.files));
    }
    
    bindReset(handler) {
        this.resetBtn?.addEventListener("click", () => handler());
    }

    // --- Metodi per manipolare la View (Output) ---

    getLiveFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData.entries());
    }

    getSubmitFormData() {
        return new FormData(this.form);
    }
    
    updatePreview(data) {
        if (!this.adPreview) return;
        this.previewTitle.textContent = data.title || "Titolo annuncio";
        this.previewMeta.textContent = `${data.city || "Città"} • ${data.address || "Indirizzo"}`;
        this.previewPrice.textContent = `€ ${data.price || 0} / mese`;

        if (this.previewChips?.length >= 3) {
            this.previewChips[0].textContent = `${data.rooms || "-"} locali`;
            this.previewChips[1].textContent = `${data.baths || "-"} bagni`;
            this.previewChips[2].textContent = `${data.surface || "-"} m²`;
        }
    }

    updatePreviewImage(imageUrl) {
        if (!this.previewImage) return;
        this.previewImage.style.backgroundImage = imageUrl ? `url('${imageUrl}')` : "none";
        this.previewImage.style.backgroundSize = imageUrl ? "cover" : "auto";
    }

    displayPhotoPreviews(files, deleteHandler) {
        this.photoPreviewContainer.innerHTML = "";
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const tile = document.createElement("div");
                tile.className = "photo-tile";
                tile.innerHTML = `
                  <img src="${e.target.result}" alt="foto ${index + 1}">
                  <button type="button" class="photo-del" aria-label="Rimuovi">✕</button>
                `;
                tile.querySelector(".photo-del").addEventListener("click", () => deleteHandler(index));
                this.photoPreviewContainer.appendChild(tile);
            };
            reader.readAsDataURL(file);
        });
    }

    setLoading(isLoading) {
        const submitBtn = this.form?.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.textContent = isLoading ? "Pubblicazione..." : "Pubblica annuncio";
        }
    }

    reset() {
        this.form?.reset();
        this.photoPreviewContainer.innerHTML = "";
        this.updatePreview({});
        this.updatePreviewImage(null);
    }
    
    navigateTo(url) {
        window.location.href = url;
    }
}
