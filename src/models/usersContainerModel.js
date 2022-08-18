const UserContainer = require("../Contenedores/Users")

const users = new UserContainer("users", {
    email: { type: String, required: true},
    username: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = users;