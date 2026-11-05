if (!estaLogueado()) {
    window.location.href = 'login.html'
}

// si hay datos en el localStorage
// en mascotas pongo el dato que traigo de ahí
// y si no hay datos a mascotas le asigno un array vacio
const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];

const listadoMascotas = document.getElementById('listado-mascotas');
const total = document.getElementById('total');
const formulario = document.getElementById('form-mascota');

const formularioEditar = document.getElementById('form-editar');
const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));
let idMascotaEditar;

// la funcion recibe un parametro
// con el id de la mascota correspondiente
function eliminarMascota(id) {
    const indice = mascotas.findIndex((mascota) => mascota.idMascota === id);
    mascotas.splice(indice, 1);
    guardarEnLocalStorage();
    render();
}

function editarMascota(id) {
    idMascotaEditar = id;

    const mascota = mascotas.find((mascota) => mascota.idMascota === id);

    document.getElementById('editarNombreDuenio').value = mascota.nombreDuenio;
    document.getElementById('editarNombreMascota').value = mascota.nombreMascota;
    document.getElementById('editarColor').value = mascota.color;
    document.getElementById('editarEdad').value = mascota.edad;
    document.getElementById('editarPeso').value = mascota.peso;

    modalEditar.show();
}

// función para cargar los datos
// al entrar en la web
function render() {
    // primer paso limpiar la tabla por si hay datos previos motrandose, que no se dupliquen
    listadoMascotas.innerHTML = '';

    mascotas.forEach((mascota) => {
        listadoMascotas.innerHTML += `
            <tr>
                <td>${mascota.nombreDuenio}</td>

                <td>${mascota.nombreMascota}</td>

                <td>${mascota.color}</td>

                <td>${mascota.edad}</td>

                <td>${mascota.peso}</td>

                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarMascota('${mascota.idMascota}')">
                        Eliminar
                    </button>       

                    <button class="btn btn-warning btn-sm" onclick="editarMascota('${mascota.idMascota}')">
                        Editar
                    </button>
                </td>
            </tr>
        `
    });

    total.textContent = mascotas.length;
};

render();

function guardarEnLocalStorage() {
    // setItem para guardar datos en localStorage
    // recibe 2 parametros, el primero es el nombre con el que 
    // se guardaria el dato, y el segundo parametro es el array de mascotas
    localStorage.setItem('mascotas', JSON.stringify(mascotas))
}


formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nuevaMascota = {
        idMascota: crypto.randomUUID(),
        // usar datos.get y pasarle por parametro 
        // el valor de la propiedad name de el input que queremos capturar
        // por ejemplo en el html tenemos <input type="text" name="nombreDuenio" id="nombreDuenio" class="form-control" required>
        nombreDuenio: datos.get('nombreDuenio').trim(),
        nombreMascota: datos.get('nombreMascota').trim(),
        color: datos.get('color').trim(),
        edad: Number(datos.get('edad')),
        peso: parseFloat(datos.get('peso'))
    }

    mascotas.push(nuevaMascota);
    
    guardarEnLocalStorage();

    render();
    formulario.reset();
})


formularioEditar.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
        const datos = new FormData(formularioEditar);

        const mascota = mascotas.find((mascota) => mascota.idMascota === idMascotaEditar);

        mascota.nombreDuenio = datos.get('editarNombreDuenio').trim();
        mascota.nombreMascota = datos.get('editarNombreMascota').trim();
        mascota.color = datos.get('editarColor').trim();
        mascota.edad = Number(datos.get('editarEdad'));
        mascota.peso = parseFloat(datos.get('editarPeso'));

        guardarEnLocalStorage();    
        render();
        modalEditar.hide()
        idMascotaEditar = undefined;
    } catch (error) {
        console.error(error)
    }
})
