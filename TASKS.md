# Project Task Board - Find My Roommate

Questo documento contiene lo scheduling e il monitoraggio delle attività del team, organizzate secondo il modello **I'm Agicle** (Hybrid Scrum/XP).

## Ruoli del Team
* **Database & DevOps Lead** (Gestione DB e container)
* **Backend Developer** (PHP Model, API)
* **Logic / Presenter** (JS Presenter, Logic)
* **Frontend / UI Developer (Il mio ruolo)** (HTML/CSS, JS, UI)

---

## Sprint 1: Setup & Autenticazione
**Obiettivo:** Avere l'ambiente funzionante e permettere agli utenti di registrarsi e loggarsi.

| ID | User Story / Task Tecnico | Ruolo | Stato |
|:---|:---|:---:|:---:|
| **US.00** | **Configurazione Ambiente** | | |
| T0.1 | Setup `docker-compose.yml` (PHP, Apache, MySQL) | DevOps | 🟢 Done |
| T0.2 | Creazione struttura cartelle (MVP pattern) | DevOps | 🟢 Done |
| **US.01** | **Registrazione Utente** | | |
| T1.1 | Schema DB tabella `users` (password hash) | Database | 🟢 Done |
| T1.2 | API `POST /register` (Input: JSON, Output: JSON) | Backend | 🟢 Done |
| T1.3 | Form HTML Registrazione (Responsive) | **Frontend (Me)** | 🟢 Done |
| T1.4 | Logica JS: Validazione input e chiamata AJAX | Presenter | 🟢 Done |
| **US.02** | **Login & Sessione** | | |
| T2.1 | API `POST /login` con generazione Session/Token | Backend | 🟢 Done |
| T2.2 | Form HTML Login | **Frontend (Me)** | 🟢 Done |
| T2.3 | Logica JS: Gestione risposta login e redirect | Presenter | 🟢 Done |

---

## Sprint 2: Profili & Annunci
**Obiettivo:** Gli utenti possono definire chi sono (abitudini) e cosa offrono/cercano.

| ID | User Story / Task Tecnico | Ruolo | Stato |
|:---|:---|:---:|:---:|
| **US.03** | **Gestione Profilo & Abitudini** | | |
| T3.1 | Tabella DB `user_preferences` (terrazzo, ascensore, giardino, garage...) | **LEAD** | 🔴 Todo |
| T3.2 | API `GET/PUT /profile` per leggere/aggiornare dati | **BACK** | 🟢 Done |
| T3.3 | UI Pagina Profilo con checkbox/slider abitudini | **VIEW** | 🟢 Done |
| T3.4 | JS: Popolamento dinamico form da JSON | **PRES** | 🟢 Done |
| **US.04** | **Creazione Annuncio Stanza** | | |
| T4.1 | Tabella DB `ads` (prezzo, foto, descrizione) | **LEAD** | 🔴 Todo |
| T4.2 | API CRUD `annunci.php` | **BACK** | 🟢 Done |
| T4.3 | UI Homepage e Form Creazione | **VIEW** | 🟢 Done |
| T4.4 | JS: Gestione invio annuncio e feedback utente | **PRES** | 🟢 Done |

---

## Sprint 3: Algoritmo Matching & Ricerca
**Obiettivo:** Implementare il cuore intelligente dell'applicazione.

| ID | User Story / Task Tecnico | Ruolo | Stato |
|:---|:---|:---:|:---:|
| **US.05** | **Algoritmo di Matching** | | |
| T5.1 | Logica PHP: Calcolo punteggio compatibilità (0-100%) | **BACK** | 🟢 Done |
| T5.2 | API `GET /search?filters` che restituisce array ordinato per score | **BACK** | 🟢 Done |
| **US.06** | **Visualizzazione Risultati** | | |
| T6.1 | UI Card Annuncio | **VIEW** | 🟢 Done |
| T6.2 | JS: Rendering lista risultati e filtri dinamici | **PRES** | 🟢 Done |

---

## Sprint 4: Rifinitura & Extra
**Obiettivo:** Messaggistica di base e pulizia codice.

| ID | User Story / Task Tecnico | Ruolo | Stato |
|:---|:---|:---:|:---:|
| **US.07** | **Contatta Utente** | | |
| T7.1 | Tabella `messages` e API invio/ricezione | **LEAD/BACK**| 🟢 Done |
| T7.2 | Modale di contatto e lista messaggi ricevuti | **VIEW/PRES**| 🟢 Done |
