const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// Lista utenti (simulazione)
const users = {
    "druv": "druv04",
    "prova": "prova123"
};

// Endpoint per il login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        res.json({ success: true, username });
    } else {
        res.status(401).json({ success: false, message: "Credenziali errate" });
    }
});

// WebSocket per la chat
io.on("connection", (socket) => {
    console.log("Un utente si è connesso:", socket.id);

    socket.on("chat-message", (data) => {
        console.log("Messaggio ricevuto:", data);
        io.emit("chat-message", data); 
    });

    socket.on("disconnect", () => {
        console.log("Utente disconnesso:", socket.id);
    });
});

// Avvia il server
server.listen(3000, () => {
    console.log("Server avviato su http://localhost:3000");
});
