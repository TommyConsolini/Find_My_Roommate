/**
 * @class AdPublishPresenter
 * @description Gestisce la logica per la creazione e pubblicazione di un annuncio.
 * @author FedeeSki (PRES)
 */
class AdPublishPresenter {
    /**
     * @param {AdPublishModel} model
     ** @param {AdPublishView} view
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.photoFiles = []; // Stato interno per i file delle foto

        // Binding degli eventi
        this.view.bindSubmit(() => this.handlePublish());
        this.view.bindFormChange((data) => this.view.updatePreview(data));
        this.view.bindPhotoChange((files) => this.handlePhotoSelection(files));
        this.view.bindReset(() => this.handleReset());

        // Inizializzazione
        this.view.updatePreview({});
    }

    handlePhotoSelection(files) {
        this.photoFiles = Array.from(files).slice(0, 6);
        this.view.displayPhotoPreviews(this.photoFiles, (index) => this.handleDeletePhoto(index));
        
        if (this.photoFiles.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => this.view.updatePreviewImage(e.target.result);
            reader.readAsDataURL(this.photoFiles[0]);
        } else {
            this.view.updatePreviewImage(null);
        }
    }

    handleDeletePhoto(index) {
        this.photoFiles.splice(index, 1);
        // Ricrea i file nell'input per mantenere la coerenza
        const dataTransfer = new DataTransfer();
        this.photoFiles.forEach(file => dataTransfer.items.add(file));
        this.view.photoInput.files = dataTransfer.files;

        this.handlePhotoSelection(this.photoFiles);
    }
    
    handleReset() {
        this.photoFiles = [];
        this.view.reset();
    }

    async handlePublish() {
        const formData = this.view.getSubmitFormData();
        
        // Validazione (logica di presentazione)
        if (!formData.get("title") || !formData.get("price") || !formData.get("city")) {
            uiToast("Campi mancanti", "Titolo, prezzo e città sono obbligatori.");
            return;
        }

        this.view.setLoading(true);
        try {
            const result = await this.model.createAd(formData);
            uiToast("Successo", "Annuncio pubblicato correttamente!");
            
            // Reindirizza alla pagina dell'annuncio
            if (result.adId) {
                setTimeout(() => this.view.navigateTo(`ad.html?id=${result.adId}`), 500);
            } else {
                this.handleReset();
            }
        } catch (error) {
            uiToast("Errore", `Pubblicazione fallita: ${error.message}`);
        } finally {
            this.view.setLoading(false);
        }
    }
}
