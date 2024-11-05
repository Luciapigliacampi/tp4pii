obtenerProductos();

let tablaProductosC = document.getElementById("tablaProductosC");
let productosAgregados = document.getElementById('productosAgregados');

let botonVista = document.getElementById("botonVista");
botonVista.addEventListener("click", () => {

    if (botonVista.classList.contains("fa-th-large")) {
        botonVista.classList.replace("fa-th-large", "fa-list");
        console.log("Click view square");
        tablaProductosC.style.display = "none";
        productosAgregados.style.display = "flex";
        obtenerCuadriculaProductos();
    }
    else {
        botonVista.classList.replace("fa-list", "fa-th-large");
        console.log("Click view list");
        productosAgregados.style.display = "none";
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

const selectOrden = document.getElementById('selectOrden');
selectOrden.addEventListener('change', () => {
    let orden = "";
    switch (selectOrden.value) {
        case 'ASC':
            orden = 'p.descripcion ASC'
            break;
        case 'DESC':
            orden = 'p.descripcion DESC'
            break;
        case 'MEN':
            orden = 'p.precio ASC'
            break;
        case 'MAY':
            orden = 'p.precio DESC'
            break;
        default:
            orden = 'p.descripcion ASC'
            break;
    }
    
    obtenerProductos(textoBusqueda.value, orden);
});

const selectFiltro = document.getElementById('selectFiltro');
selectFiltro.addEventListener('change', () => {
    let categoria = ""
    if(selectFiltro.value != "") {
        categoria = `WHERE p.id_rubro = ${selectFiltro.value}`
    }
    
    obtenerProductos(textoBusqueda.value, "p.descripcion ASC", categoria);
});

let datos = []

function obtenerProductos(busqueda = "", orden = "p.descripcion ASC", categoria = "") {
    let filtro = busqueda ? `?buscar=${busqueda}&orden=${orden}` : `?orden=${orden}`;
    if(categoria != "") {
        filtro = filtro + `&categoria=${categoria}`
    }

    axios.get(`http://localhost:3000/productos${filtro}`)
        .then(respuesta => {
            datos = respuesta.data;
            if (botonVista.classList.contains("fa-th-large")) {
                obtenerListaProductos();
            }
            else {
                obtenerCuadriculaProductos();
        
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

function obtenerCuadriculaProductos() {

    productosAgregados.innerHTML = '';

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
                productosAgregados.appendChild(col);
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