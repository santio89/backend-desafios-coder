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

        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.querySelector(".login__inputEmail").value;
            const password = document.querySelector(".login__inputPassword").value
            const obj = {
                username: true,
                email: nombre,
                password: password
            }

            let errorTimeout = 0;

            fetch("/login", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj),
                credentials: 'include'
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res.status === "ok") {
                    window.location.href = "/";
                } else {
                    if (res.error) {
                        clearTimeout(errorTimeout);
                        const errorDiv = document.querySelector(".login__error");
                        errorDiv.textContent = `Error: ${res.message}`
                        errorDiv.classList.add("is-active");

                        errorTimeout = setTimeout(() => {
                            errorDiv.classList.remove("is-active");
                            errorDiv.innerHTML = "&nbsp;";
                        }, 2000)
                    }
                }
            })
        })

        /* register */
        const registerModal = document.querySelector(".register__modal")
        const registerModalClose = document.querySelector(".register__modal__close")
        const registerButton = document.querySelector(".register__btn")
        const registerForm = document.querySelector(".register__modal__form")

        const userReg = document.querySelector("#userReg")
        const emailReg = document.querySelector("#emailReg")
        const passwordReg = document.querySelector("#passwordReg")

        registerButton.addEventListener("click", () => {
            registerModal.showModal();

            const modalCloseClick = (e) => { if (e.target === registerModal) { window.removeEventListener("mousedown", modalCloseClick); registerModal.close(); userReg.value = ""; emailReg.value = ""; passwordReg.value = "" } };
            window.addEventListener("mousedown", modalCloseClick);

            registerModalClose.addEventListener("click", () => { window.removeEventListener("click", modalCloseClick); registerModal.close() })
        })


        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const obj = {
                username: userReg.value,
                email: emailReg.value,
                password: passwordReg.value
            }

            let errorTimeout = 0;
            let successTimeout = 0;

            fetch("/register", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }).then((data) => data.json()).then(data => {
                if (data.status === "ok") {
                    clearTimeout(successTimeout)
                    const successDiv = document.querySelector(".register__success")
                    registerForm.style.display = "none";
                    successDiv.classList.add("is-active");

                    successDiv.innerHTML = `
                    <p>Registrado Correctamente</p>
                    <p>User: ${obj.username}</p>
                    <p>E-Mail: ${obj.email}</p>
                    `

                    successTimeout = setTimeout(() => {
                        registerForm.style.display = "flex";
                        successDiv.classList.remove("is-active");
                        registerModal.close();
                        userReg.value = "";
                        emailReg.value = "";
                        passwordReg.value = "";
                    }, 4000)
                } else {
                    clearTimeout(errorTimeout);
                    const errorDiv = document.querySelector(".register__error");
                    errorDiv.textContent = `Error: ${data.message}`
                    errorDiv.classList.add("is-active");

                    errorTimeout = setTimeout(() => {
                        errorDiv.classList.remove("is-active");
                        errorDiv.innerHTML = "&nbsp;";
                    }, 2000)
                }
            })
        })

        return;
    }

    /* info */
    const infoOpen = document.querySelector(".info__modal__open");
    const infoModal = document.querySelector(".info__modal");
    const infoClose = document.querySelector(".info__modal__close");
    const infoText = document.querySelector(".info__modal__text")

    infoOpen.addEventListener("click", async () => {
        const infoRes = await fetch("/info");
        const info = await infoRes.json();

        if (info.status === 401){
            window.location.href = "/";
            return;
        } else{
            infoModal.showModal()

            const modalCloseClick = (e) => { if (e.target === infoModal) { window.removeEventListener("mousedown", modalCloseClick); infoModal.close(); infoText.innerHTML = ``} };
            window.addEventListener("mousedown", modalCloseClick);
    
            infoClose.addEventListener("click", () => {
                infoModal.close();
                window.removeEventListener("mousedown", modalCloseClick);
            })

            infoText.innerHTML = `• Argumentos: ${JSON.stringify(info.args)}\n• Plataforma: ${info.platform}\n• Versión: ${info.version}\n• Memoria rss: ${info.memory.rss}\n• Path: ${info.path}\n• PID: ${info.pid}\n• Carpeta: ${info.folder}\n• CPUs: ${info.cpus}`
        }
    })

    /* login salute */
    const salute = document.querySelector(".header__salute");
    salute.style.visibility = "visible";
    salute.innerHTML = `Bievenido, ${logStatus.user.email}!`

    const loginSaluteTimeout = setTimeout(() => {
        salute.innerHTML = ``;
        salute.style.visibility = "hidden";
    }, 2000);

    /* logout */
    const logout = document.querySelector(".logout");
    logout.addEventListener("click", (e) => {
        e.preventDefault();
        fetch(`/logout`).then(res => {
            return res.json()
        }).then(res => {
            if (res.status === "ok") {
                clearTimeout(loginSaluteTimeout);
                salute.style.visibility = "visible";
                salute.innerHTML = `Hasta luego, ${res.user.email}!`

                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else {
                window.location.href = "/";
            }
        })
    })

    /* datos user */
    const datosOpen = document.querySelector(".datos__modal__open")
    const datosClose = document.querySelector(".datos__modal__close")
    const datosModal = document.querySelector(".datos__modal")


    /* productos */
    const form = document.querySelector(".formulario__form");
    form.addEventListener("submit", async e => {
        e.preventDefault();

        /* checkeo tener session activa */
        try {
            const logged = await fetch("/logged")
            const logStatus = await logged.json()

            if (logStatus.status === 401) {
                window.location.href = "/";
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
                window.location.href = "/";
                return
            }

        } catch (e) {
            console.log("error fetching login: ", e)
        }

        const mensajeEnvio = {
            author: {
                email: chatNombre.value,
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

    const mensajeContainer = document.createElement("div");

    const nombre = document.createElement("span");
    nombre.textContent = mensajeEnvio.author.email + " ";
    nombre.classList.add("chat__container__mensajes__nombre")

    const fecha = document.createElement("span");
    fecha.textContent = `${new Date(mensajeEnvio.createdAt).toLocaleString()}: `;
    fecha.classList.add("chat__container__mensajes__fecha")

    const mensaje = document.createElement("span");
    mensaje.classList.add("chat__container__mensajes__mensaje");
    mensaje.textContent = mensajeEnvio.text;

    mensajeContainer.appendChild(nombre);
    mensajeContainer.appendChild(fecha);
    mensajeContainer.appendChild(mensaje);

    mensajesContainer.appendChild(mensajeContainer);

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

        await renderItems(items, logStatus);

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

        await renderItems(items, logStatus);

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




