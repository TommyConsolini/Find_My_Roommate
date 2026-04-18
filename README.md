# Find My Roommate

**Find My Roommate** è un'applicazione web progettata per facilitare l'incontro tra persone che cercano una stanza e chi ne offre una. Il sistema utilizza un algoritmo di **matching** basato sulla compatibilità di abitudini e preferenze personali per garantire la migliore convivenza possibile.

*Progetto universitario realizzato in team (metodologia Agile/Scrum) presso l'Università degli Studi di Parma.*

## Il mio ruolo (Frontend / UI)
All'interno del team di sviluppo, ho ricoperto il ruolo di **VIEW Developer**. Mi sono occupato principalmente di:
* Progettazione dell'interfaccia utente (UI) e sviluppo del frontend responsivo utilizzando **HTML5 e CSS3**.
* Gestione della logica di presentazione e interazione utente (**JavaScript/jQuery**).
* Integrazione asincrona del frontend con le RESTful API del backend.
* Creazione della documentazione generale e presentazione del progetto.
---

## Architettura e Tecnologie

Il progetto segue rigorosamente i vincoli architettonici imposti:


* **Pattern Architetturale**: Model-View-Presenter (MVP).


* **Backend**: PHP nativo, agisce esclusivamente come data provider tramite JSON (nessuna generazione di codice HTML tramite PHP).


* **Frontend**: HTML5, CSS3, JavaScript/JQuery.


* **Comunicazione**: RESTful API di tipo CRUD.


* **Infrastruttura**: Containerizzazione tramite **Docker**.



---


## Come avviare il progetto in locale
Per testare il progetto sul proprio computer è sufficiente utilizzare Docker:
1. Assicurati di avere **Docker Desktop** installato e in esecuzione.
2. Clona questo repository.
3. Apri il terminale nella directory principale del progetto.
4. Esegui il comando: `docker-compose up`
