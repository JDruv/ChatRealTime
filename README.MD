# 💬 Real-Time Chat App | Personal Project

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-ffffff?style=for-the-badge&logo=socket.io&logoColor=black)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

Benvenuti nel mio progetto personale! Ho deciso di costruire da zero un'applicazione di messaggistica istantanea completa, sicura e ad alte prestazioni, curandone ogni singolo dettaglio architetturale e stilistico. Costruita con **Node.js** ed **Express**, sfrutta le reali potenzialità dei WebSocket tramite **Socket.io** per la comunicazione bidirezionale a bassa latenza e adotta standard di sicurezza moderni come l'autenticazione tramite **JSON Web Tokens (JWT)**.

Ho realizzato il frontend interamente in puro **Vanilla JavaScript** (sfruttando le potenzialità dei moduli ES6+), per dimostrare una solida padronanza nativa del DOM e delle API del browser senza dipendere da alcun framework esterno (come React, Vue o Angular). Il tutto è incorniciato da una UI/UX personalizzata, moderna e fluida, ispirata apertamente al Glassmorphism e al Material Design.

---

## 🏗️ Architettura & Scelte Ingegneristiche

### 🗄️ Fake ODM: Simulazione di MongoDB su File JSON
Per mantenere il progetto agilissimo e portatile (nessun fastidioso setup di database esterni per chi lo clona) ma preservandone l'eleganza architetturale, ho scelto di **non** usare un semplice array hardcoded. 

Al contrario, ho implementato un mio personale **"Fake ODM" (Object Data Modeling) asincrono**. Il sistema gestisce file JSON locali (`server/data/users.json` e `messages.json`) esponendo metodi rigorosamente basati su Promise (es. `User.findOne()`, `Message.insertOne()`) che **simulano in tutto e per tutto il comportamento e le firme di librerie Enterprise come Mongoose**. 

In questo modo, la logica di business nei miei Controller resta completamente isolata e agnostica. Se un domani decidessi di rimpiazzare il Fake ODM con un vero cluster MongoDB, mi basterà aggiornare unicamente il Layer dei Modelli, garantendo che oltre il 99% del codice dell'applicazione (Router, Controller, Socket) continui a funzionare intatto. (Inoltre, ho generato ID univoci in modo nativo sfruttando la performante API `crypto.randomUUID()` di Node.js!).

### 🔒 Sicurezza & Autenticazione (JWT)
Ho costruito il sistema abbandonando completamente l'idea di sessioni superficiali o il deprecato uso del solo `sessionStorage`. 
- **Bcrypt:** Le password degli utenti vengono opportunamente "salate" e sottoposte ad hashing tramite `bcryptjs` ancor prima di toccare il file di memorizzazione.
- **JWT (JSON Web Token):** Al momento del Login (o Registrazione), il mio server "stacca" un token cifrato crittograficamente (firmato da una Secret Key in `.env`). Questo token viene immagazzinato nel Client ed utilizzato per autorizzare non solo le chiamate API HTTP, ma cosa fondamentale, **l'handshake iniziale del WebSocket**. Senza un Token valido, la connessione Socket.io viene rifiutata, garantendo che nessun client non autorizzato possa mai iniettare messaggi o spiare gli eventi broadcast.

---

## ✨ Funzionalità Principali

* ⚡ **Real-Time Reale:** Nessun workaround o banale polling a tempo. I messaggi vengono consegnati bidirezionalmente e istantaneamente tramite stream Socket a tutti i client connessi.
* 🕒 **Sincronizzazione Temporale Server-Side:** Non mi fido dell'orario del sistema operativo dei client. I timestamp dei messaggi vengono generati dal mio Server Node.js all'atto di inserimento nel DB, prevenendo qualsiasi discrepanza. Il frontend si occupa poi di formattare le date in maniera intelligente (es. *"Oggi, 17:21"* o *"Ieri, 14:30"*).
* ✍️ **Typing Indicator Dinamico:** Ho ideato e introdotto un sistema di notifica live "Sta scrivendo..." che informa il gruppo, animato in CSS da tre morbidi puntini "saltellanti".
* 📜 **Persistenza e Storico Iniziale:** Quando ti connetti e vieni validato, il server invia automaticamente l'history degli ultimi 50 messaggi recuperati dal database simulato, popolando immediatamente la vista.
* 🎨 **UI/UX Mozzafiato e Curata:**
  - Nessuna transizione a scatti. L'arrivo di ogni messaggio è accompagnato da un'animazione `@keyframes` in *slide-up* e *fade-in*.
  - **Auto-scroll** super fluido ("smooth-scrolling") che accompagna morbidamente la vista focalizzandosi sull'ultimo messaggio arrivato.
  - Al posto di `alert()` o rudimentali scritte in rosso, ho implementato un sistema personalizzato di **Notifiche Toast a comparsa laterale (Slide in Right)** per gestire e comunicare l'esito di registrazioni, credenziali errate o disconnessioni socket, che svaniscono autonomamente dopo 3 secondi.

---

## 🚀 Come provare l'app in locale

Dato l'approccio "Batteries Included" del repository, per avviare il mio progetto occorrono meno di 20 secondi:

1. Clona la repository sul tuo PC.
2. Apri il terminale della cartella e lancia:
   ```bash
   npm install
   ```
   *(installerà Express, Socket.io, UUID, cors, dotenv, jsonwebtoken e bcryptjs).*
3. (Opzionale) Personalizza il tuo file `.env` se vuoi variare porta e chiavi segrete.
4. Avvia semplicemente:
   ```bash
   npm start
   ```
   *(oppure `node server/server.js`)*.
5. Apri **[http://localhost:3000](http://localhost:3000)** dal tuo browser preferito. (Ti consiglio di aprire due finestre vicine o una normale e una in Incognito, per loggarti con due account differenti e goderti la reattività della Chat!).

## visuale app

![immagine 1](/screen/Screen1.png)

![immagine 1](/screen/Screen2.png)


