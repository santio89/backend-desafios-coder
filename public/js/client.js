const socket = io();

async function renderItems(items, logStatus) {
    /* plantilla */
    const plantillaResponse = await fetch("./ejs/clientMain.ejs");
    const plantilla = await plantillaResponse.text();
    const html = ejs.render(plantilla, { productos: items.productos, mensajes: items.mensajes, user: logStatus.user || null });
    document.getElementById('root').innerHTML = html;

    if (logStatus.status === 401) {
        /* login */
        const formLogin = document.querySelector(".login__form");
        const login = document.querySelector(".login")

        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.querySelector(".login__input").value;

            fetch(`/login?username=${nombre}`).then(res => {
                return res.json()
            }).then(res => {
                if (res.status === "ok") {
                    window.location.reload();
                } else {
                    console.log("error logging in")
                }

            })
        })

        login.addEventListener("click", () => {
            formLogin.requestSubmit();
        })

        return;
    }

    /* logout */
    const logout = document.querySelector(".logout");
    logout.addEventListener("click", (e) => {
        e.preventDefault();
        fetch(`/logout`).then(res => {
            return res.json()
        }).then(res => {
            if (res.status === "ok") {
                const salute = document.querySelector(".header__salute");
                salute.style.visibility = "visible";
                salute.innerHTML = `Hasta luego, ${res.user}!`

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                console.log("error logging out")
            }
        })
    })

    /* productos */
    const form = document.querySelector(".formulario__form");
    form.addEventListener("submit", async e => {
        e.preventDefault();

        /* checkeo tener session activa */
        try {
            const logged = await fetch("/logged")
            const logStatus = await logged.json()

            if (logStatus.status === 401) {
                window.location.reload();
                return
            }

        } catch (e) {
            console.log("error fetching login: ", e)
        }


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

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        /* checkeo tener session activa */
        try {
            const logged = await fetch("/logged")
            const logStatus = await logged.json()

            if (logStatus.status === 401) {
                window.location.reload();
                return
            }

        } catch (e) {
            console.log("error fetching login: ", e)
        }

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

function displayTable() {
    const table = document.querySelector(".productos__table")
    const noProd = document.querySelector(".productos__noProd")
    if (table?.classList?.contains("d-none")) {
        table.classList.remove("d-none")
        noProd.classList.add("d-none")
    }
}

function renderProducto(item) {
    displayTable();
    const table = document.querySelector(".productos__table")

    const row = document.createElement("tr");
    const titleTd = document.createElement("td")
    const imgTd = document.createElement("td")
    const img = document.createElement("img")
    const priceTd = document.createElement("td")

    titleTd.innerHTML = item.title;
    img.src = item.imgUrl;
    priceTd.innerHTML = `$${item.price} USD`
    imgTd.appendChild(img)
    row.appendChild(titleTd)
    row.appendChild(imgTd)
    row.appendChild(priceTd)
    table.appendChild(row)

    /*     table.innerHTML += `<tr>
        <td>${item.title}</td>
        <td><img alt="item img" src="${item.imgUrl}"/></td>
        <td>$${item.price} USD</td>
        </tr>` */
}

function renderMensaje(mensajeEnvio) {
    const mensajesContainer = document.querySelector(".chat__container__mensajes");
    mensajesContainer.innerHTML += `<div><span class="chat__container__mensajes__nombre">${mensajeEnvio.author.id}</span><span class="chat__container__mensajes__fecha"> ${new Date(mensajeEnvio.createdAt).toLocaleString()}: </span><span class="chat__container__mensajes__mensaje">${mensajeEnvio.text}</span></div>`;

    mensajesContainer.scroll({ top: mensajesContainer.scrollHeight, behavior: "smooth" })
}

function renderOptimization(optimization) {
    const optimizationContainer = document.querySelector(".chat__optimization")
    optimizationContainer.innerHTML += `<b>${optimization}%</b>`;
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
    const porcentajeOptimizacion = (100 - ((logitudNormalized * 100) / longitudDenormalized)).toFixed(2);


    /* al desnormalizar, me qedan los items en una propiedad _doc, por tanto creo el array de mensajes mapeando _doc */
    const mensajesDenormalizados = denormalized.mensajes.map(mensaje => mensaje._doc)

    return { mensajesDenormalizados, porcentajeOptimizacion };
}

socket.on("server:items", async items => {
    const { mensajesDenormalizados, porcentajeOptimizacion } = denormalizeMensajes(items.mensajes)
    items.mensajes = mensajesDenormalizados
    items.optimization = porcentajeOptimizacion;

    /* fetch status a la session */
    try {
        const logged = await fetch("/logged")
        const logStatus = await logged.json()

        renderItems(items, logStatus);

        if (logStatus.status === 401) {
            return
        }
    } catch (e) {
        console.log("error fetching login: ", e)
    }
})

socket.on("server:items-test", async items => {
    /* server:item-test -> similar a server:items, pero el array de productos lo recibo vacio, y en vez hago un fetch al endpoint mock de productos */
    const { mensajesDenormalizados, porcentajeOptimizacion } = denormalizeMensajes(items.mensajes)
    items.mensajes = mensajesDenormalizados
    items.optimization = porcentajeOptimizacion;

    /* fetch status a la session */
    try {
        const logged = await fetch("/logged")
        const logStatus = await logged.json()

        renderItems(items, logStatus);

        if (logStatus.status === 401) {
            return
        }
    } catch (e) {
        console.log("error fetching login: ", e)
    }


    displayTable()
    const mockData = await fetch("/api/productos-test")
    const mockProducts = await mockData.json()

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




