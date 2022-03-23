class Carrito {

    //Añadir habitacion al carrito
    comprarHabitacion(e){
        e.preventDefault();
        //Delegado para agregar al carrito
        if(e.target.classList.contains('agregar-carrito')){
            const habitacion = e.target.parentElement.parentElement;
            //Enviamos el habitacion seleccionado para tomar sus datos
            this.leerDatosHabitacion(habitacion);
        }
    }

    //Leer datos del habitacion
    leerDatosHabitacion(habitacion){
        const infoHabitacion = {
            imagen : habitacion.querySelector('img').src,
            titulo: habitacion.querySelector('h4').textContent,
            precio: habitacion.querySelector('.precio span').textContent,
            id: habitacion.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        let habitacionesLS;
        habitacionesLS = this.obtenerHabitacionsLocalStorage();
        habitacionesLS.forEach(function (habitacionLS){
            if(habitacionLS.id === infoHabitacion.id){
                habitacionesLS = habitacionLS.id;
            }
        });

        if(habitacionesLS === infoHabitacion.id){
            Swal.fire({
                type: 'info',
                title: 'Oops...',
                text: 'La habitacion ya está agregado',
                showConfirmButton: false,
                timer: 1000
            })
        }
        else {
            this.insertarCarrito(infoHabitacion);
        }
        
    }

    //muestra habitacion seleccionado en carrito
    insertarCarrito(habitacion){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${habitacion.imagen}" width=100>
            </td>
            <td>${habitacion.titulo}</td>
            <td>${habitacion.precio}</td>
            <td>
                <a href="#" class="borrar-habitacion fas fa-times-circle" data-id="${habitacion.id}"></a>
            </td>
        `;
        listaHabitacions.appendChild(row);
        this.guardarHabitacionsLocalStorage(habitacion);

    }

    //Eliminar el habitacion del carrito en el DOM
    eliminarHabitacion(e){
        e.preventDefault();
        let habitacion, habitacionID;
        if(e.target.classList.contains('borrar-habitacion')){
            e.target.parentElement.parentElement.remove();
            habitacion = e.target.parentElement.parentElement;
            habitacionID = habitacion.querySelector('a').getAttribute('data-id');
        }
        this.eliminarHabitacionLocalStorage(habitacionID);
        this.calcularTotal();

    }

    //Elimina todos las habitaciones
    vaciarCarrito(e){
        e.preventDefault();
        while(listaHabitacions.firstChild){
            listaHabitacions.removeChild(listaHabitacions.firstChild);
        }
        this.vaciarLocalStorage();

        return false;
    }

    //Almacenar en el LS
    guardarHabitacionsLocalStorage(habitacion){
        let habitaciones;
        //Toma valor de un arreglo con datos del LS
        habitaciones = this.obtenerHabitacionsLocalStorage();
        //Agregar el habitacion al carrito
        habitaciones.push(habitacion);
        //Agregamos al LS
        localStorage.setItem('habitaciones', JSON.stringify(habitaciones));
    }

    //Comprobar que hay elementos en el LS
    obtenerHabitacionsLocalStorage(){
        let habitacionLS;

        //Comprobar si hay algo en LS
        if(localStorage.getItem('habitaciones') === null){
            habitacionLS = [];
        }
        else {
            habitacionLS = JSON.parse(localStorage.getItem('habitaciones'));
        }
        return habitacionLS;
    }

    //Mostrar los habitaciones guardados en el LS
    leerLocalStorage(){
        let habitacionesLS;
        habitacionesLS = this.obtenerHabitacionsLocalStorage();
        habitacionesLS.forEach(function (habitacion){
            //Construir plantilla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${habitacion.imagen}" width=100>
                </td>
                <td>${habitacion.titulo}</td>
                <td>${habitacion.precio}</td>
                <td>
                    <a href="#" class="borrar-habitacion fas fa-times-circle" data-id="${habitacion.id}"></a>
                </td>
            `;
            listaHabitacions.appendChild(row);
        });
    }

    //Mostrar los habitaciones guardados en el LS en compra.html
    leerLocalStorageCompra(){
        let habitacionesLS;
        habitacionesLS = this.obtenerHabitacionsLocalStorage();
        habitacionesLS.forEach(function (habitacion){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${habitacion.imagen}" width=100>
                </td>
                <td>${habitacion.titulo}</td>
                <td>${habitacion.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${habitacion.cantidad}>
                </td>
                <td id='subtotales'>${habitacion.precio * habitacion.cantidad}</td>
                <td>
                    <a href="#" class="borrar-habitacion fas fa-times-circle" style="font-size:30px" data-id="${habitacion.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    //Eliminar habitacion por ID del LS
    eliminarHabitacionLocalStorage(habitacionID){
        let habitacionesLS;
        //Obtenemos el arreglo de habitaciones
        habitacionesLS = this.obtenerHabitacionsLocalStorage();
        //Comparar el id del habitacion borrado con LS
        habitacionesLS.forEach(function(habitacionLS, index){
            if(habitacionLS.id === habitacionID){
                habitacionesLS.splice(index, 1);
            }
        });

        //Añadimos el arreglo actual al LS
        localStorage.setItem('habitaciones', JSON.stringify(habitacionesLS));
    }

    //Eliminar todos los datos del LS
    vaciarLocalStorage(){
        localStorage.clear();
    }

    //Procesar pedido
    procesarPedido(e){
        e.preventDefault();

        if(this.obtenerHabitacionsLocalStorage().length === 0){
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'El carrito está vacío, agrega algún habitacion',
                showConfirmButton: false,
                timer: 2000
            })
        }
        else {
            location.href = "compra.html";
        }
    }

    //Calcular montos
    calcularTotal(){
        let habitacionesLS;
        let total = 0, igv = 0, subtotal = 0;
        habitacionesLS = this.obtenerHabitacionsLocalStorage();
        for(let i = 0; i < habitacionesLS.length; i++){
            let element = Number(habitacionesLS[i].precio * habitacionesLS[i].cantidad);
            total = total + element;
            
        }
        
        igv = parseFloat(total * 0.18).toFixed(2);
        subtotal = parseFloat(total-igv).toFixed(2);

        document.getElementById('subtotal').innerHTML = "S/. " + subtotal;
        document.getElementById('igv').innerHTML = "S/. " + igv;
        document.getElementById('total').value = "S/. " + total.toFixed(2);
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, habitacion, habitacionesLS;
        if (e.target.classList.contains('cantidad')) {
            habitacion = e.target.parentElement.parentElement;
            id = habitacion.querySelector('a').getAttribute('data-id');
            cantidad = habitacion.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            habitacionesLS = this.obtenerHabitacionsLocalStorage();
            habitacionesLS.forEach(function (habitacionLS, index) {
                if (habitacionLS.id === id) {
                    habitacionLS.cantidad = cantidad;                    
                    actualizarMontos[index].innerHTML = Number(cantidad * habitacionesLS[index].precio);
                }    
            });
            localStorage.setItem('habitaciones', JSON.stringify(habitacionesLS));
            
        }
        else {
            console.log("click afuera");
        }
    }
}