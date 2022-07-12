const express = require("express")
const routesApi = require("./routes/indexApiRoutes").router;
const ChatContainer = require("./Chat")
const { contenedorProductos } = require("./controllers/apiController")
const { Server: IOServer } = require("socket.io");
const chatsDatabase = require("./db/database").sqliteConnection;

const chat = new ChatContainer(chatsDatabase, "chats");

const path = require("path")
const app = express();
const port = 8080;

/* post url encode */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* serve static files */
app.use(express.static(path.join(__dirname, "../public")))

/* routes main */
app.use("/api/productos", routesApi)

/* not found */
app.use((req, res) => {
    res.status(404).json({error404: "Ruta no encontrada"});
})

// error handler
app.use(function (err, req, res, next) {
    res.status(500).json({
        error: err.message,
    });
});

/* start server */
const expressServer = app.listen(port, (err) => {
    if (!err) {
        console.log(`El servidor se inicio en el puerto ${port}`)
    } else {
        console.log(`Hubo un error al iniciar el servidor: `, err)
    }
})

const io = new IOServer(expressServer);

io.on("connection", async socket => {
    console.log("Nuevo usuario conectado")

    const mensajes = await chat.getAll();
    const productos = await contenedorProductos.getAll();

    socket.emit("server:items", {productos, mensajes})

    socket.on("client: producto", async producto => {
        await contenedorProductos.save(producto);

        io.emit("server:producto", producto);
    })

    socket.on("client:mensaje", async mensajeEnvio => {
        await chat.save(mensajeEnvio);

        io.emit("server:mensaje", mensajeEnvio);
    })
})

