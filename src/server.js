const express = require("express")
const routesApi = require("./routes/indexApiRoutes").router;
const routesProdTest = require("./routes/productosTest").router;
const path = require("path")
const ChatContainer = require("./Chat")
const { contenedorProductos } = require("./controllers/apiController")
const { Server: IOServer } = require("socket.io");
const normalizeMensajes = require("../util/normalize")
const session = require("express-session")

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


const app = express();
const port = 8080;

/* post url encode */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: "coderproject",
    resave: true,
    saveUninitialized: true,
}))

/* serve static files */
app.use(express.static(path.join(__dirname, "../public"))) 

function auth (req, res, next){
    if (req.session.admin === true){
        next();
    } else{
        res.sendFile(path.join(__dirname, "../public/login.html"))
    }
}

app.get("/", auth, (req,res)=>{res.sendFile(path.join(__dirname, "../publicAdm/indexAdmin.html"))})

app.get("/session-test", (req, res)=>{
    if(req.session.contador){
        req.session.contador++;
        return res.send("visitas: "+req.session.contador)
    } else{
        req.session.contador = 1;
        res.send("esta es tu primera visita")
    }
})

app.get("/login", (req, res)=>{
    const {username} = req.query;
    req.session.user = username;
    req.session.admin = true;
   
    res.json({status:'ok', user: req.session.user})
})

app.get("/logout", (req, res)=>{
    const user = req.session.user;
    req.session.destroy(err=>{
        if (err){
            res.status(500).json({status: "error", body: err})
        } else{
            res.json({status: "ok", user})
        }
    })
})

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
 
    socket.emit("server:items-test", { productos: [], mensajes: normalizedMensajes })


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

