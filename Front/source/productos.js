obtenerProductos();

const textoBusqueda = document.getElementById("textoBusqueda");
let retardoEspera = null;
textoBusqueda.addEventListener('input', (event) => {
    event.preventDefault();
    clearTimeout(retardoEspera);
    retardoEspera = setTimeout(() => {
        obtenerProductos(textoBusqueda.value)
    }, 300);

})

function obtenerProductos(busqueda = "") {
    let filtro = ""
    if (busqueda == "") {
        filtro = ""
    } else {
        filtro = `?buscar=${busqueda}`
    }
    axios.get(`http://localhost:3000/productos${filtro}`)
        .then(respuesta => {

            let datos = respuesta.data;

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

                imagen.alt = 'Imagen del producto';

                datoImagen.appendChild(imagen)



                // let datoNumeroPedido = document.createElement('td');
                // let enlacePedido = document.createElement('a');
                // enlacePedido.href = "#";
                // enlacePedido.setAttribute("data-toggle", "modal")
                // enlacePedido.setAttribute("data-target", "#modal-default")
                // enlacePedido.textContent = `#${registro.id_pedido}`;
                // datoNumeroPedido.appendChild(enlacePedido)



                // let acciones = document.createElement('td');
                // acciones.classList.add('d-md-table-cell');
                // let botonEliminar = document.createElement('button');

                // botonEliminar.classList.add('btn', 'btn-sm', 'ms-2', 'me-2');
                // botonEliminar.innerHTML = '<i class="fas fa-trash text-danger"></i>'

                // botonEliminar.addEventListener('click', function () {
                //     Swal.fire({
                //         title: "¿Desea eliminar el producto?",
                //         showCancelButton: true,
                //         confirmButtonText: "Confirmar",
                //         confirmButtonColor: "#1952A0"
                //     }).then((result) => {
                //         if (result.isConfirmed) {
                //             eliminarProducto(registro.id_producto);
                //         }
                //     });
                // });

                // let botonModificar = document.createElement('button');
                // botonModificar.classList.add('btn', 'btn-sm', 'ms-2', 'me-2');
                // botonModificar.innerHTML = '<i class="fas fa-edit"></i>'
                // botonModificar.setAttribute("data-toggle", "modal")
                // botonModificar.setAttribute("data-target", "#modal-default")

                // botonModificar.addEventListener('click', function (event) {
                //     obtenerProducto(registro.id_producto)
                // })

                // acciones.appendChild(botonEliminar);
                // acciones.appendChild(botonModificar);

                filaTabla.appendChild(datoDescripcion);
                filaTabla.appendChild(datoPrecio);
                filaTabla.appendChild(datoImagen);

                tablaProductos.appendChild(filaTabla);
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

function eliminarProducto(id) {
    axios.delete('http://localhost:3000/productos/' + id)
        .then(respuesta => {
            Swal.fire({
                text: "Producto eliminado correctamente",
                icon: "success",
                confirmButtonColor: "#1952A0"
            });
            obtenerProductos();
        })
        .catch(error => {
            Swal.fire({
                text: "Ocurrio un error al eliminar producto",
                icon: "error",
                confirmButtonColor: "#1952A0"
            });
        });
}

let formulario = document.getElementById('formulario');
let nombre = document.getElementById('nombre');
let idProducto = document.getElementById('idProducto');
let apellido = document.getElementById('apellido');
let tipoDocumento = document.getElementById('tipoDocumento');
let numeroDoc = document.getElementById('numeroDoc');
let telefono = document.getElementById('telefono');
let email = document.getElementById('email');
let calle = document.getElementById('calle');
let numeroDir = document.getElementById('numeroDir');
let piso = document.getElementById('piso');
let departamento = document.getElementById('departamento');
let localidad = document.getElementById('localidad');
let barrio = document.getElementById('barrio');
let tipoProducto = document.getElementById('tipoProducto');

formulario.addEventListener("submit", validarDatos);

function obtenerProducto(id) {
    let contenedorErrores = document.getElementById("contenedorErrores");

    contenedorErrores.innerHTML = "";

    obtenerLocalidades();

    obtenerTipoDoc();

    obtenerCondicionIVA();

    obtenerTipoProducto();

    axios.get('http://localhost:3000/productos/' + id)
        .then(respuesta => {
            console.log(respuesta.data);
            nombre.value = respuesta.data.nombre;
            apellido.value = respuesta.data.apellido;
            numeroDoc.value = respuesta.data.numero_documento;
            telefono.value = respuesta.data.telefono;
            email.value = respuesta.data.correo_electronico;
            calle.value = respuesta.data.calle;
            numeroDir.value = respuesta.data.numero_dir;
            piso.value = respuesta.data.piso;
            departamento.value = respuesta.data.departamento;
            tipoProducto.value = respuesta.data.id_tipo_producto;
            localidad.value = respuesta.data.id_localidad;
            idProducto.value = respuesta.data.id_producto

            obtenerBarrios(respuesta.data.id_localidad, respuesta.data.id_barrio)

            tipoDocumento.value = respuesta.data.id_tipo_documento;
            condicionIVA.value = respuesta.data.id_condicion;
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        })
}


let selectLocalides = document.getElementById("localidad");
function obtenerLocalidades() {
    selectLocalides.innerHTML = ""

    axios.get('http://localhost:3000/localidades')
        .then(respuesta => {
            let datos = respuesta.data;

            for (let indice = 0; indice < datos.length; indice++) {
                let registro = datos[indice];

                const option = document.createElement('option');

                option.value = registro.id_localidad
                option.textContent = registro.nombre

                selectLocalides.appendChild(option)

            }

        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

let selectBarrios = document.getElementById("barrio");

selectLocalides.addEventListener("change", function () {
    const id_localidad = this.value

    if (id_localidad == "") {
        return
    }

    obtenerBarrios(id_localidad)
})

function obtenerBarrios(id_localidad, id_barrio = 0) {

    selectBarrios.innerHTML = "";
    axios.get('http://localhost:3000/barrios/' + id_localidad)
        .then(respuesta => {

            let datos = respuesta.data;

            for (let indice = 0; indice < datos.length; indice++) {
                let registro = datos[indice];

                const option = document.createElement('option');

                option.value = registro.id_barrio
                option.textContent = registro.nombre

                selectBarrios.appendChild(option)
            }

            if (id_barrio != 0) {
                selectBarrios.value = id_barrio
            }

        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

let selectTipoDoc = document.getElementById("tipoDocumento");

function obtenerTipoDoc() {
    selectTipoDoc.innerHTML = ""
    axios.get('http://localhost:3000/tipos_documento/')
        .then(respuesta => {

            let datos = respuesta.data;

            for (let indice = 0; indice < datos.length; indice++) {
                let registro = datos[indice];

                const option = document.createElement('option');

                option.value = registro.id_tipo_documento
                option.textContent = registro.nombre

                selectTipoDoc.appendChild(option)
            }

        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

let selectCondIVA = document.getElementById("condicionIVA");

function obtenerCondicionIVA() {
    selectCondIVA.innerHTML = ""
    axios.get('http://localhost:3000/tipos_iva/')
        .then(respuesta => {

            let datos = respuesta.data;

            for (let indice = 0; indice < datos.length; indice++) {
                let registro = datos[indice];

                const option = document.createElement('option');

                option.value = registro.id_condicion
                option.textContent = registro.nombre

                selectCondIVA.appendChild(option)
            }

        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

let selectTipoProducto = document.getElementById("tipoProducto");


function obtenerTipoProducto() {
    selectTipoProducto.innerHTML = ""
    axios.get('http://localhost:3000/tipos_producto/')
        .then(respuesta => {

            let datos = respuesta.data;

            for (let indice = 0; indice < datos.length; indice++) {
                let registro = datos[indice];

                const option = document.createElement('option');

                option.value = registro.id_tipo_producto
                option.textContent = registro.nombre

                selectTipoProducto.appendChild(option)
            }

        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
}

function validarDatos(event) {
    let errores = [];
    event.preventDefault()
    if (nombre.value == "") {
        console.log("nombre vacio")
        errores.push("*Nombre es requerido");
    }
    else if (nombre.value.length > 60) {
        errores.push("*Nombre debe tener como máximo 60 caracteres");
    };

    if (apellido.value.trim() == "") {
        console.log("apellido vacio")
        errores.push("*Apellido es requerido");
    }
    else if (apellido.value.length > 60) {
        errores.push("*Apellido debe tener como máximo 60 caracteres");
    };

    if (tipoDocumento.value == "" || isNaN(tipoDocumento.value)) {
        console.log("tipo de documento vacio")
        errores.push("*Tipo de documento es requerido");
    }

    console.log(numeroDoc.value);

    if (numeroDoc.value == "" || isNaN(numeroDoc.value)) {
        console.log("número documento vacio")
        errores.push("*Número documento es requerido, si desconoce el dato, ingrese 0");
    }

    if (telefono.value.trim() == "") {
        console.log("teléfono vacio")
        errores.push("*Teléfono es requerido");
    }
    else if (telefono.value.length > 12) {
        errores.push("*Teléfono debe tener como máximo 12 caracteres");
    };

    if (calle.value.trim() == "") {
        console.log("calle vacio")
        errores.push("*Calle es requerido");
    }
    else if (calle.value.length > 60) {
        errores.push("*Calle debe tener como máximo 60 caracteres");
    };

    if (numeroDir.value == "" || isNaN(numeroDir.value)) {
        console.log("número direccion vacio")
        errores.push("*Número en dirección es requerido, si desconoce el dato, ingrese 0");
    }

    if (localidad.value == "" || isNaN(localidad.value)) {
        console.log("localidad vacio")
        errores.push("*Localidad es requerida");
    }
    if (barrio.value == "" || isNaN(barrio.value)) {
        console.log("barrio vacio")
        errores.push("*Barrio es requerido");
    }

    let selectLocalides = document.getElementById("localidad");

    contenedorErrores.innerHTML = "";

    if (errores.length > 0) {

        errores.forEach(function (item, index) {
            parrafo = document.createElement('p');
            contenedorErrores.appendChild(parrafo);
            parrafo.textContent = item;
            parrafo.classList.add("mb-1")
        });
        return
    }

    const producto = crearObjeto()
    console.log(producto);

    axios.put('http://localhost:3000/productos/' + idProducto.value, producto)
        .then(response => {
            if (response.data.error) {
                alert(response.data.error)
            } else {
                alert(response.data.message)
                location.reload()
            }
        })
        .catch(error => {
            if (error.response.data.error) {
                alert(error.response.data.error)
            } else {
                alert(error.message)
            }
        });
}

function crearObjeto() {
    let contenidoFormulario = {
        nombre: nombre.value,
        apellido: apellido.value,
        telefono: telefono.value,
        calle: calle.value,
        id_barrio: barrio.value,
        id_localidad: localidad.value,
        correo_electronico: email.value,
        id_tipo_producto: tipoProducto.value,
        id_tipo_documento: tipoDocumento.value,
        numero_documento: numeroDoc.value,
        estado: 1,
        numero_dir: numeroDir.value,
        piso: piso.value == "" ? null : piso.value,
        departamento: departamento.value,
        id_condicion: condicionIVA.value == "" ? 1 : condicionIVA.value
    }

    return contenidoFormulario
}