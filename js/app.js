// clase Producto
class Producto {
    constructor(nombre, valor, descripcion, img) {
        this.nombre = nombre;
        this.valor = valor;
        this.descripcion = descripcion;
        this.img = img;
        this.cantidad = 1; 
    }
}

// array de productos
const productos = [
    new Producto("Remera Básica", 690, "Algodón 100%", "./img/remera1.jpg"),
    new Producto("Remera Estampada", 566, "Diseño único", "./img/remera2.jpg"),
    new Producto("Remera Sport", 876, "Secado rápido", "./img/remera3.jpg"),
    new Producto("Remera Casual", 1000, "Estilo clásico", "./img/remera4.jpg"),
    new Producto("Remera Oversize", 790, "Tendencia juvenil", "./img/remera5.jpg"),
    new Producto("Remera Formal", 999, "Elegancia moderna", "./img/remera6.jpg"),
    new Producto("Remera Vintage", 899, "Estilo retro", "./img/remera7.jpg"),
    new Producto("Remera Running", 898, "Ligera y cómoda", "./img/remera8.jpg"),
];

// cargar carrito desde localstorage
const cargarCarrito = () => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
};

// guardar carrito en localstorage
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

    productosFiltrados.map((producto, index) => {
        if (!producto.nombre || !producto.valor || !producto.img) {
            console.warn("Producto incompleto:", producto);
            return;
        }

        const divProducto = document.createElement("div");
        divProducto.classList.add("product");
        divProducto.innerHTML = `
            <img src="${producto.img}" alt="Imagen de ${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.valor.toFixed(2)}</p>
            <button class="btnAgregar" data-index="${index}">AÑADIR AL CARRITO</button>
        `;
        contenedor.appendChild(divProducto);
    });

   
    document.querySelectorAll(".btnAgregar").forEach(boton => {
        boton.addEventListener("click", (evento) => {
            const index = evento.target.getAttribute("data-index");
            agregarAlCarrito(productos[index]);
        });
    });
};


const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find((p) => p.nombre === producto.nombre);
    if (productoExistente) {
        productoExistente.cantidad += 1; 
    } else {
        carrito.push({ ...producto });
    }
    guardarCarrito(carrito);
    actualizarCantidadCarrito(); 
    mostrarCarrito(); 
};


const mostrarCarrito = () => {
    const contenedorCarrito = document.getElementById("carritoItems");
    if (!contenedorCarrito) return;

    // Limpia el carrito
    contenedorCarrito.innerHTML = "";

    if (!carrito || carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        document.getElementById("totalCarrito").textContent = "$0.00";
        return;
    }

    let total = 0;
    carrito.map((producto, index) => {
        const divItem = document.createElement("div");
        divItem.classList.add("carritoItem");
        divItem.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" class="carritoImg">
            <div>
                <h3>${producto.nombre}</h3>
                <p>$${producto.valor.toFixed(2)}</p>
                <div>
                    <button class="btnRestar" data-index="${index}">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="btnSumar" data-index="${index}">+</button>
                </div>
            </div>
            <button class="btnEliminar" data-index="${index}">Eliminar</button>
        `;
        contenedorCarrito.appendChild(divItem);

        total += producto.valor * producto.cantidad;
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

// sumar  producto en el carrito
const sumarCantidad = (index) => {
    carrito[index].cantidad += 1;
    guardarCarrito(carrito);
    actualizarCantidadCarrito(); 
    mostrarCarrito();
};

// eliminar  producto del carrito
const eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    actualizarCantidadCarrito(); 
    mostrarCarrito();
};


const actualizarCantidadCarrito = () => {
    const cantidadCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    document.getElementById("cantidadCarrito").textContent = cantidadCarrito;
};

// mostrar productos iniciales
mostrarProductos(productos);
mostrarCarrito();
actualizarCantidadCarrito(); 