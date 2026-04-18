/**
 * @class ProfileView
 * @description Gestisce esclusivamente la manipolazione del DOM per la pagina profilo.
 * Implementa il pattern Passive View.
 * @author FedeeSki (PRES)
 */
class ProfileView {
    constructor() {
        // Elementi UI generali
        this.navItems = Array.from(document.querySelectorAll(".nav-item[data-tab]"));
        this.panels = Array.from(document.querySelectorAll(".panel[data-panel]"));
        this.contactEmail = document.getElementById("contactEmail");
        this.contactPhone = document.getElementById("contactPhone");
        this.fullNameEl = document.getElementById("fullName");
        this.initialsEl = document.getElementById("profileInitials");
        
        // Elementi del Form
        this.form = document.getElementById("profileForm");
        this.birthDate = document.getElementById("birth_date");
        this.gender = document.getElementById("gender");
        this.hasPets = document.getElementById("has_pets");
        this.isSmoker = document.getElementById("is_smoker");
        this.bio = document.getElementById("bio");
        this.saveBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;
    }

    /**
     * @method bindTabClick
     * @description Collega l'evento di cambio tab a un handler esterno.
     * @param {Function} handler 
     */
    bindTabClick(handler) {
        this.navItems.forEach(b => b.addEventListener("click", () => handler(b.dataset.tab)));
    }

    /**
     * @method bindSubmit
     * @description Collega l'invio del form a un handler esterno.
     * @param {Function} handler 
     */
    bindSubmit(handler) {
        if (this.form) {
            this.form.addEventListener("submit", (e) => {
                e.preventDefault();
                handler();
            });
        }
    }

    /**
     * @method showTab
     * @description Gestisce la visibilità dei pannelli in base al tab selezionato.
     * @param {string} tabId 
     */
    showTab(tabId) {
        this.navItems.forEach(b => b.classList.toggle("active", b.dataset.tab === tabId));
        this.panels.forEach(p => p.hidden = p.dataset.panel !== tabId);
    }

    /**
     * @method setProfileData
     * @description Popola i campi del form con i dati forniti. (Task T3.4)
     * @param {Object} profile 
     */
    setProfileData(profile) {
        if (this.birthDate && profile.birth_date) this.birthDate.value = profile.birth_date;
        if (this.gender && profile.gender) this.gender.value = profile.gender;
        if (this.hasPets) this.hasPets.checked = !!profile.has_pets;
        if (this.isSmoker) this.isSmoker.checked = !!profile.is_smoker;
        if (this.bio) this.bio.value = profile.bio ?? "";
    }

    /**
     * @method setHeaderInfo
     * @description Aggiorna le informazioni di testata e contatti.
     */
    setHeaderInfo(fullName, initials, email, phone) {
        if (this.fullNameEl) this.fullNameEl.textContent = fullName || "—";
        if (this.initialsEl) this.initialsEl.textContent = initials || "FM";
        if (this.contactEmail) this.contactEmail.textContent = email || "—";
        if (this.contactPhone) {
            if (phone) {
                this.contactPhone.textContent = phone;
                this.contactPhone.classList.remove("muted");
            } else {
                this.contactPhone.textContent = "Non fornito";
                this.contactPhone.classList.add("muted");
            }
        }
    }

    /**
     * @method getFormData
     * @description Raccoglie i dati dal form in un oggetto.
     * @returns {Object}
     */
    getFormData() {
        return {
            birth_date: this.birthDate?.value || null,
            gender: this.gender?.value || null,
            has_pets: !!this.hasPets?.checked,
            is_smoker: !!this.isSmoker?.checked,
            bio: this.bio?.value || ""
        };
    }

    /**
     * @method setLoading
     * @description Gestisce lo stato visuale del pulsante di salvataggio.
     * @param {boolean} isLoading 
     */
    setLoading(isLoading) {
        if (this.saveBtn) {
            this.saveBtn.disabled = isLoading;
            this.saveBtn.textContent = isLoading ? "Salvataggio..." : "Salva";
        }
    }
}
