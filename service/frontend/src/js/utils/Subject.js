/**
 * @class Subject
 * @description Implementa la parte "Soggetto" del pattern Observer.
 * Mantiene una lista di osservatori (funzioni) e li notifica quando accade un evento.
 * @author FedeeSki (PRES) - Architetto del pattern
 */
class Subject {
    constructor() {
        this.observers = [];
    }

    /**
     * @method subscribe
     * @description Aggiunge un osservatore (handler) alla lista.
     * @param {Function} observer - La funzione da chiamare alla notifica.
     */
    subscribe(observer) {
        this.observers.push(observer);
    }

    /**
     * @method unsubscribe
     * @description Rimuove un osservatore dalla lista.
     * @param {Function} observer - La funzione da rimuovere.
     */
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    /**
     * @method notify
     * @description Notifica tutti gli osservatori registrati, passando loro dei dati.
     * @param {*} data - I dati da passare all'osservatore.
     */
    notify(data) {
        if (this.observers.length > 0) {
            this.observers.forEach(observer => observer(data));
        }
    }
}
