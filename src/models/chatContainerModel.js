const ChatContainer = require("../Contenedores/Chat")

const chat = new ChatContainer("chats", {
    author: {
        email: { type: String, required: true },
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        edad: { type: Number, required: true },
        alias: { type: String, required: true },
        avatar: { type: String, required: true }
    },
    text: { type: String, required: true }
});

module.exports = chat;