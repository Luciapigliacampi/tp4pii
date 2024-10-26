const formularioLogin = document.getElementById("formularioLogin")
formularioLogin.addEventListener('submit', (event) => {
    event.preventDefault()

    const datos = new FormData(formularioLogin)
    
    console.log(datos.get("usuario"));
    

    if(datos.get("usuario") != "luciapiglia" || datos.get("password") != "12345") {
        alert("Usuario o clave incorrecta");
        return;
    }

    location.href = "panel.html"
    
})