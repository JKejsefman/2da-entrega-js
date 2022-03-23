const carro = new Carrito();
const carrito = document.getElementById("carrito");
const habitaciones = document.getElementById("lista-habitaciones");
const listaHabitaciones = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const procesarPedidoBtn = document.getElementById("procesar-pedido");

cargarEventos();

function cargarEventos() {
	//Se ejecuta cuando se presionar agregar carrito
	habitaciones.addEventListener("click", (e) => {
		carro.comprarHabitacion(e);
	});

	//Cuando se elimina habitaciones del carrito
	carrito.addEventListener("click", (e) => {
		carro.eliminarHabitacion(e);
	});

	//Al vaciar carrito
	vaciarCarritoBtn.addEventListener("click", (e) => {
		carro.vaciarCarrito(e);
	});

	//Al cargar documento se muestra lo almacenado en LS
	document.addEventListener("DOMContentLoaded", () => {
		carro.leerLocalStorage();
		fetchHabitaciones();
	});

	//Enviar pedido a otra pagina
	procesarPedidoBtn.addEventListener("click", (e) => {
		carro.procesarPedido(e);
	});
}

async function fetchHabitaciones() {
	let res = await fetch("../data/habitaciones.json");
	let data = await res.json();
	let html = "";
	data.forEach((habitacion, index) => {
		curr = `
		<div class="card mb-4 shadow-sm ">
				<div class="card-header">
					<h4 class="my-0 font-weight-bold">${habitacion.marca}</h4>
				</div>
				<div class="card-body">
					<img src=${habitacion.imagen} class="card-img-top" alt=${habitacion.marca}>
					<h1 class="card-title pricing-card-title precio">S/. <span class="">${
						habitacion.precio
					}</span></h1>

					<ul class="list-unstyled mt-3 mb-4">
					${habitacion.detalles
						.map(
							(ele) => `
							<li>${ele}</li>
						`
						)
						.join("")}
					</ul>
					<a href="" class="btn btn-block btn-primary agregar-carrito" data-id=${habitacion.id}>Comprar</a>
				</div>
			</div>
		`
		if(index === 0){
			html += `<div class="card-deck mb-3 text-center md:w-10">${curr}`
		}else if(index % 3 === 0 && index !== 0){
			html += `</div><div class="card-deck mb-3 text-center md:w-10">${curr}`
		}else{
			html += curr
		}
	});
	habitaciones.innerHTML = html;
}
