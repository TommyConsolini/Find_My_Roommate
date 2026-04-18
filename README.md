# Find My Roommate

**Find My Roommate** è un'applicazione web progettata per facilitare l'incontro tra persone che cercano una stanza e chi ne offre una. Il sistema utilizza un algoritmo di **matching** basato sulla compatibilità di abitudini e preferenze personali per garantire la migliore convivenza possibile.

## Legenda Team
* **LEAD**: @BecksFedeUniPr (DB, Gestione)
* **BACK**: @luigimasdea (PHP Model, API)
* **PRES**: @FedeeSki (JS Presenter, Logic)
* **VIEW**: @TommyConsolini (HTML/CSS, JS, UI)

---

## Architettura e Tecnologie

Il progetto segue rigorosamente i vincoli architettonici imposti:


* **Pattern Architetturale**: Model-View-Presenter (MVP).


* **Backend**: PHP nativo, agisce esclusivamente come data provider tramite JSON (nessuna generazione di codice HTML tramite PHP).


* **Frontend**: HTML5, CSS3, JavaScript/JQuery.


* **Comunicazione**: RESTful API di tipo CRUD.


* **Infrastruttura**: Containerizzazione tramite **Docker**.



---

## Processo di Sviluppo

Abbiamo adottato un processo di sviluppo **"I'm Agicle"**, un modello ibrido tra **Scrum** ed **XP**.

### Sprint e Iterazioni

* Lo sviluppo è organizzato in **Sprint**.


* Ogni ciclo produce un **incremento** software testato e funzionante.


* Applichiamo il principio del **Design Semplice**: implementiamo solo ciò che è necessario per la release corrente.


### Artefatti
Tutta la documentazione è disponibile nella directory [`docs/`](https://github.com/Progetti-ING-SW-INFO-UniPR/INGSW-2526-T16/tree/docs/update-tasks/docs).
Il Product Backlog è disponibile nel file [TASKS.md](https://github.com/Progetti-ING-SW-INFO-UniPR/INGSW-2526-T16/blob/main/TASKS.md).
