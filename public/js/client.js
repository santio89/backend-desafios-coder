const socket = io();

async function renderItems(items) {
    /* plantilla */
    const plantillaResponse = await fetch("./ejs/clientMain.ejs");
    const plantilla = await plantillaResponse.text();
    const html = ejs.render(plantilla, { productos: items.productos, mensajes: items.mensajes });
    document.getElementById('root').innerHTML = html;

    /* productos */
    const form = document.querySelector(".formulario__form");
    form.addEventListener("submit", e => {
        e.preventDefault();
        const title = document.getElementById("form__title")
        const price = document.getElementById("form__price")
        const imgUrl = document.getElementById("form__imgUrl")

        socket.emit("client: producto", { title: title.value, price: price.value, imgUrl: imgUrl.value })

        title.value = "";
        price.value = "";
        imgUrl.value = "";
    })

    /* chat */
    const chatForm = document.querySelector(".chat__container");
    const chatNombre = document.querySelector(".chat__container__nombre");
    const chatMensaje = document.querySelector(".chat__container__mensaje");
    const mensajesContainer = document.querySelector(".chat__container__mensajes");
    mensajesContainer.scroll({ top: mensajesContainer.scrollHeight, behavior: "smooth" })

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const mensajeEnvio = {
            author: {
                id: chatNombre.value,
                nombre: /* nombre || */ "nombreDefault",
                apellido: /* apellido || */ "apellidoDefault",
                edad: /* edad || */ 99,
                alias: /* alias || */ "aliasDefault",
                avatar: /* avatar || */ "avatarDefault"
            },
            text: chatMensaje.value
        }

        socket.emit("client:mensaje", mensajeEnvio);
        chatMensaje.value = "";
    })

    renderOptimization(items.optimization)
}

function renderProducto(item) {
    const table = document.querySelector(".productos__table")
    table.innerHTML += `<tr>
    <td>${item.title}</td>
    <td><img alt="item img" src="${item.imgUrl}"/></td>
    <td>$${item.price} USD</td>
</tr>`
}

function renderMensaje(mensajeEnvio) {
    const mensajesContainer = document.querySelector(".chat__container__mensajes");
    mensajesContainer.innerHTML += `<div><span class="chat__container__mensajes__nombre">${mensajeEnvio.author.id}</span><span class="chat__container__mensajes__fecha"> ${new Date(mensajeEnvio.createdAt).toLocaleString()}: </span><span class="chat__container__mensajes__mensaje">${mensajeEnvio.text}</span></div>`;

    mensajesContainer.scroll({ top: mensajesContainer.scrollHeight, behavior: "smooth" })
}

function renderOptimization(optimization) {
    const optimizationContainer = document.querySelector(".chat__optimization")
    optimizationContainer.innerHTML += `<b>${optimization}</b>`;
}

function displayTable() {
    const table = document.querySelector(".productos__table")
    const noProd = document.querySelector(".productos__noProd")
    if (table?.classList?.contains("d-none")) {
        table.classList.remove("d-none")
        noProd.classList.add("d-none")
    }
}

function denormalizeMensajes(objMensajes) {
    const author = new normalizr.schema.Entity(
        "author"
    );

    const mensaje = new normalizr.schema.Entity(
        "mensaje",
        { author: author },
        { idAttribute: "_id" }
    );

    const schemaMensajes = new normalizr.schema.Entity(
        "mensajes",
        {
            mensajes: [mensaje],
        }
    );

    const denormalized = normalizr.denormalize(
        objMensajes.result,
        schemaMensajes,
        objMensajes.entities
    );


    const logitudNormalized = JSON.stringify(objMensajes).length;
    const longitudDenormalized = JSON.stringify(denormalized).length;
    console.log(logitudNormalized)
    console.log(longitudDenormalized)
    const porcentajeOptimizacion = (100 - ((logitudNormalized * 100) / longitudDenormalized)).toFixed(2);


    /* al desnormalizar, me qedan los items en una propiedad _doc, por tanto creo el array de mensajes mapeando _doc */
    const mensajesDenormalizados = denormalized.mensajes.map(mensaje => mensaje._doc)

    return { mensajesDenormalizados, porcentajeOptimizacion };
}

socket.on("server:items", items => {
    const { mensajesDenormalizados, porcentajeOptimizacion } = denormalizeMensajes(items.mensajes)
    items.mensajes = mensajesDenormalizados
    items.optimization = porcentajeOptimizacion;
    renderItems(items);
})

socket.on("server:items-test", async items => {
    /* server:item-test -> similar a server:items, pero el array de productos lo recibo vacio, y en vez hago un fetch al endpoint mock de productos */
    const { mensajesDenormalizados, porcentajeOptimizacion } = denormalizeMensajes(items.mensajes)
    items.mensajes = mensajesDenormalizados
    items.optimization = porcentajeOptimizacion;
    renderItems(items);


    const mockData = await fetch("http://localhost:8080/api/productos-test")
    const mockProducts = await mockData.json()
    displayTable();
    mockProducts.forEach(product => {
        renderProducto(product)
    })
})

socket.on("server:producto", producto => {
    displayTable();
    renderProducto(producto);
})

socket.on("server:mensaje", mensajeEnvio => {
    renderMensaje(mensajeEnvio)
})