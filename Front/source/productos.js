obtenerProductos();

let tablaProductosC = document.getElementById("tablaProductosC");
let itemsInsertados = document.getElementById('itemsInsertados');

let botonVista = document.getElementById("botonVista");
botonVista.addEventListener("click", () => {

    if (botonVista.classList.contains("fa-th-large")) {
        botonVista.classList.replace("fa-th-large", "fa-list");
        console.log("Click view square");
        tablaProductosC.style.display = "none";
        itemsInsertados.style.display = "flex";
        obtenerCuadriculaProductos();
    }
    else {
        botonVista.classList.replace("fa-list", "fa-th-large");
        console.log("Click view list");
        itemsInsertados.style.display = "none";
        tablaProductosC.style.display = "block";
        obtenerListaProductos();

    }
})

const textoBusqueda = document.getElementById("textoBusqueda");
let retardoEspera = null;
textoBusqueda.addEventListener('input', (event) => {
    event.preventDefault();
    clearTimeout(retardoEspera);
    retardoEspera = setTimeout(() => {
        obtenerProductos(textoBusqueda.value);
    }, 300);

})

let botonFiltro = document.getElementById("botonFiltro")
botonFiltro.addEventListener("click", () => {
    
})

switch (key) {
    case value:
        
        break;

    default:
        break;
}

let datos = []

function obtenerProductos(busqueda = "") {
    let filtro = "";
    if (busqueda == "") {
        filtro = "";
    } else {
        filtro = `?buscar=${busqueda}`;
    }

    axios.get(`http://localhost:3000/productos${filtro}`)
        .then(respuesta => {
            datos = respuesta.data;
            obtenerListaProductos()
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

function obtenerCuadriculaProductos() {

    itemsInsertados.innerHTML = '';

            datos.forEach(data => {
                const col = document.createElement('div');
                col.classList.add('col-md-4', 'mb-4'); // 3 tarjetas por fila pantlla med

                col.innerHTML = `
            <div class="card h-100">
                <img width="250" src="${data.URLImagen}" class="card-img-top" alt="${data.descripcion}">
                <div class="card-body">
                    <h5 class="card-title">${data.descripcion}</h5>
                    <p class="card-text">
                        $${data.precio}
                    </p>
                </div>
            </div>
        `;
                itemsInsertados.appendChild(col);
            })
}

function obtenerListaProductos() {

    let tablaProductos = document.getElementById("tablaProductos");
            tablaProductos.innerHTML = "";

            for (let indice = 0; indice < datos.length; indice++) {
                let registro = datos[indice];

                let filaTabla = document.createElement('tr');

                let datoDescripcion = document.createElement('td');
                datoDescripcion.textContent = registro.descripcion;

                let datoPrecio = document.createElement('td');
                datoPrecio.textContent = `$${registro.precio}`;

                let datoImagen = document.createElement('td');

                let imagen = document.createElement('img');
                imagen.src = registro.URLImagen;
                imagen.width = 200

                imagen.alt = 'Imagen del producto';

                datoImagen.appendChild(imagen)

                filaTabla.appendChild(datoDescripcion);
                filaTabla.appendChild(datoPrecio);
                filaTabla.appendChild(datoImagen);

                tablaProductos.appendChild(filaTabla);
            }
}