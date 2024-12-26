
class Producto {
    constructor(nombre, valor, descripcion, img) {
        this.nombre = nombre;
        this.valor = valor;
        this.descripcion = descripcion;
        this.img = img;
        this.cantidad = 1; 
    }
}

const cargarProductos = async () => {
    try {
        const response = await fetch('./data/productos.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo productos.json');
        }
        const productosData = await response.json();
        return productosData.map(prod => new Producto(prod.nombre, prod.valor, prod.descripcion, prod.img));
    } catch (error) {
        console.error('Error cargando los productos:', error);
        return []; 
    }
};

const cargarCarrito = () => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
};

const guardarCarrito = (carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

let carrito = cargarCarrito();

const mostrarProductos = (productosFiltrados) => {
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) return;

    contenedor.innerHTML = ""; 
    if (!Array.isArray(productosFiltrados) || productosFiltrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    productosFiltrados.map(({ nombre, valor, img }, index) => {
        if (!nombre || !valor || !img) {
            console.warn("Producto incompleto:", { nombre, valor, img });
            return;
        }

        
        const divProducto = document.createElement("div");
        divProducto.classList.add("col-12", "col-sm-6", "col-md-6", "col-lg-4", "product");  
        divProducto.innerHTML = `
            <div class="card mb-4" style="height: 100%;"> <!-- Agregar margen y control de altura -->
                <img src="${img}" alt="Imagen de ${nombre}" class="card-img-top" style="height: 250px; object-fit: cover;"> <!-- Ajustar la imagen para que ocupe más espacio -->
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${nombre}</h5>
                    <p class="card-text">$${valor.toFixed(2)}</p>
                    <button class="btn btn-primary btnAgregar" data-index="${index}">AÑADIR AL CARRITO</button>
                </div>
            </div>
        `;
        contenedor.appendChild(divProducto);
    });

    document.querySelectorAll(".btnAgregar").forEach(boton => {
        boton.addEventListener("click", (evento) => {
            const index = evento.target.getAttribute("data-index");
            agregarAlCarrito(productosFiltrados[index]);
        });
    });
};

const agregarAlCarrito = ({ nombre, valor, descripcion, img }) => {
    const productoExistente = carrito.find((p) => p.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, valor, descripcion, img, cantidad: 1 });
    }
    guardarCarrito(carrito);
    actualizarCantidadCarrito();
    mostrarCarrito();
};


const mostrarCarrito = () => {
    const contenedorCarrito = document.getElementById("carritoItems");
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";

    if (!carrito || carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        document.getElementById("totalCarrito").textContent = "$0.00";
        return;
    }

    let total = 0;
    carrito.map(({ nombre, valor, img, cantidad }, index) => {
        const divItem = document.createElement("div");
        divItem.classList.add("carritoItem");
        divItem.innerHTML = `
            <img src="${img}" alt="${nombre}" class="carritoImg">
            <div>
                <h3>${nombre}</h3>
                <p>$${valor.toFixed(2)}</p>
                <div>
                    <button class="btnRestar" data-index="${index}">-</button>
                    <span>${cantidad}</span>
                    <button class="btnSumar" data-index="${index}">+</button>
                </div>
            </div>
            <button class="btnEliminar" data-index="${index}">Eliminar</button>
        `;
        contenedorCarrito.appendChild(divItem);

        total += valor * cantidad;
    });

    document.getElementById("totalCarrito").textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll(".btnRestar").forEach(boton => {
        boton.addEventListener("click", (evento) => {
            const index = evento.target.getAttribute("data-index");
            restarCantidad(index);
        });
    });

    document.querySelectorAll(".btnSumar").forEach(boton => {
        boton.addEventListener("click", (evento) => {
            const index = evento.target.getAttribute("data-index");
            sumarCantidad(index);
        });
    });

    document.querySelectorAll(".btnEliminar").forEach(boton => {
        boton.addEventListener("click", (evento) => {
            const index = evento.target.getAttribute("data-index");
            eliminarDelCarrito(index);
        });
    });
};

const restarCantidad = (index) => {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
    } else {
        eliminarDelCarrito(index);
    }
    guardarCarrito(carrito);
    actualizarCantidadCarrito();
    mostrarCarrito();
};

const sumarCantidad = (index) => {
    carrito[index].cantidad += 1;
    guardarCarrito(carrito);
    actualizarCantidadCarrito();
    mostrarCarrito();
};

const eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    actualizarCantidadCarrito();
    mostrarCarrito();
};

const actualizarCantidadCarrito = () => {
    const cantidadCarrito = carrito.reduce((total, { cantidad }) => total + cantidad, 0);
    document.getElementById("cantidadCarrito").textContent = cantidadCarrito;
};

const init = async () => {
    const productosCargados = await cargarProductos();
    mostrarProductos(productosCargados);
    mostrarCarrito();
    actualizarCantidadCarrito();
};

init();