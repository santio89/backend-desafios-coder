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

function displayTable() {
    const table = document.querySelector(".productos__table")
    const noProd = document.querySelector(".productos__noProd")
    if (table.classList.contains("d-none")) {
        table.classList.remove("d-none")
        noProd.classList.add("d-none")
    }
}

socket.on("server:items", items => {
    /* desnormalizar items.mensajes */
    renderItems(items);
})

socket.on("server:items-test", async items => {
    /* server:item-test -> similar a server:items, pero el array de productos lo recibo vacio, y en vez hago un fetch al endpoint mock de productos */

    /* desnormalizar items.mensajes */
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
    /* desnormalizar mensajeEnvio */
    renderMensaje(mensajeEnvio)
})