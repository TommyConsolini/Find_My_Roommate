## Suddivisione dei Diagrammi

### 1. Membro A: Leader / DevOps (@BecksFedeUniPr)

_Si occupa dell'infrastruttura e dei dati._

-   **Modellazione Fisica / Deployment Diagram** (slide p. 36, 159):
    
    -   _Cosa disegnare:_ I nodi Docker (Container Web, Container DB), le porte esposte (80, 3306) e i volumi.
        
-   **Diagramma E-R (Database):**
    
    -   _Cosa disegnare:_ Entità `User`, `Ad`, `Message`, `Preference` e le loro relazioni.
        
   
-   **Diagramma delle Classi (Lato Model):**
    
    -   _Cosa disegnare:_ Le classi PHP (es. `UserModel`, `AdModel`, `DBConnection`) e i loro metodi.


### 2. Membro B: Backend Developer (@luigimasdea)

_Si occupa della logica profonda e delle API._

-   **Diagramma di Sequenza** (slide pp. 95-98):
	- _Cosa disegnare:_ È il diagramma più importante per l'MVP. Devi mostrare la "staffetta": `Utente -> View (Click) -> Presenter (JS) -> API (PHP) -> Database`. Evidenzia che il ritorno è **JSON**.
        
- **Gantt**
- **PERT**
        

### 3. Membro C: Frontend Logic / Presenter (@FedeeSki)

_Si occupa del flusso logico e degli algoritmi._

-   **Diagramma di Attività** (slide pp. 100-105):
    
    -   _Cosa disegnare:_ Il flusso dell'**Algoritmo di Matching**.
        
        _Start -> Prendo Preferenze Utente -> Prendo Vincoli Annuncio -> Confronto -> Calcolo Score -> End._
        
    -   _Alternativa:_ Il flusso di Registrazione con validazione errori.
 
-   **Diagramma di Comunicazione** (slide p. 99):
    
    -   _Cosa disegnare:_ Simile a quello di sequenza ma focalizzato sugli oggetti. Mostra come `Presenter` orchestra `View` e `Model`.       


### 4. Membro D: UI / View (@TommyConsolini)

_Si occupa dell'esperienza utente e degli stati visivi e creazione generale documentazione e presentazione._

-   **Diagramma dei Casi d'Uso** (slide pp. 78-79):
    
    -   _Cosa disegnare:_ Gli attori (Guest, Seeker, Owner) e le palline (Login, Cerca, Pubblica). È la visione d'insieme.
        
-   **Diagramma di Stato** (slide pp. 80-94):
    
    -   _Cosa disegnare:_
        
        1.  **Stato dell'Annuncio:** `Draft` -> `Published` -> `Hidden` -> `Deleted`.
            
        2.  **Stato della Sessione Utente:** `Guest` -> `Authenticating` -> `Logged In` -> `Expired`.
