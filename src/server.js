const express = require("express")
const routesApi = require("./routes/indexApiRoutes").router;
const routesProdTest = require("./routes/productosTest").router;
const ChatContainer = require("./Chat")
const { contenedorProductos } = require("./controllers/apiController")
const { Server: IOServer } = require("socket.io");
const normalizeMensajes = require("../util/normalize")


const chat = new ChatContainer("chats", {
    author: {
        id: { type: String, required: true },
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        edad: { type: Number, required: true },
        alias: { type: String, required: true },
        avatar: { type: String, required: true }
    },
    text: { type: String, required: true }
});


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
app.use("/api/productos-test", routesProdTest)

/* not found */
app.use((req, res) => {
    res.status(404).json({ error404: "Ruta no encontrada" });
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

     /*   obtiene productos desde el contenedor de productos. de momento queda comentado ya que estoy probando los datos con mocks (server:items-test)   

        const productos = await contenedorProductos.getAll();
        socket.emit("server:items", {productos, mensajes}) 
    */

    const mensajes = await chat.getAll();
    /*aca voy a normalizar los mensajes del array antes de mandar al front. tiene sentido normalizar ya que un array de mensajes puede ser pesado y tener redundancias */
    const normalizedMensajes = normalizeMensajes(mensajes);
    
    socket.emit("server:items-test", { productos: [], normalizedMensajes })


    socket.on("client: producto", async producto => {
        await contenedorProductos.save(producto);

        io.emit("server:producto", producto);
    })

    socket.on("client:mensaje", async mensajeEnvio => {
        /* cuando envio 1 solo mensaje, normalizarlo no tiene mucho sentido. simplemente lo guardo en la base de datos y luego si se guardo ok emito el mismo mensaje que ya tengo en memoria. */
        const savedMessage = await chat.save(mensajeEnvio);
        io.emit("server:mensaje", savedMessage);
    })
})

