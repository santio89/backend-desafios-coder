const form = document.querySelector(".login__form");
const login = document.querySelector(".login")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.querySelector(".login__input").value;
    
    fetch(`http://localhost:8080/login?username=${nombre}`).then(res => {
        return res.json()
    }).then(res => {
        if (res.status === "ok") {
            window.location.pathname = "/"
        } else {
            console.log("error logging in")
        }

    })
})

login.addEventListener("click", ()=>{
    form.requestSubmit();
})
