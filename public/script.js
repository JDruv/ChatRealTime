document.addEventListener("DOMContentLoaded", function () {
    // Verifica se siamo sulla pagina di login
    if (document.getElementById("login-form")) {
        document.getElementById("login-form").addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    sessionStorage.setItem("loggedInUser", username);
                    window.location.href = "chat.html"; // Reindirizza alla chat
                } else {
                    document.getElementById("error-message").style.display = "block";
                }
            } catch (error) {
                console.error("Errore durante il login", error);
            }
        });
    }

    // Verifica se siamo sulla pagina della chat
    if (document.getElementById("send")) {
        const socket = io();
        const username = sessionStorage.getItem("loggedInUser");

        if (!username) {
            window.location.href = "index.html"; // Se non loggato, torna al login
        }
        
        document.getElementById("username-placeholder").innerHTML = "Accesso efettuato come : " + username;

        document.getElementById("logout").addEventListener("click", () => {
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });

        function sendMessage() {
            const messageInput = document.getElementById("message");
            const message = messageInput.value.trim();

            if (message !== "") {
                socket.emit("chat-message", { username, message });
                messageInput.value = "";
            }
        }

        document.getElementById("send").addEventListener("click", sendMessage);
        document.getElementById("message").addEventListener("keypress", function (event) {
            if (event.key === "Enter") sendMessage();
        });

        socket.on("chat-message", (data) => {
            const chatMessages = document.getElementById("chat-messages");
            const newMessage = document.createElement("div");

            // Controlla se il messaggio è inviato dall'utente loggato o ricevuto
            if (data.username === username) {
                newMessage.classList.add("message", "sent");
            } else {
                newMessage.classList.add("message", "received");
            }

            newMessage.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
            chatMessages.appendChild(newMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
});
