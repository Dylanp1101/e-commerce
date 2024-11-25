
class Producto {
    constructor(nombre, valor, descripcion, img) {
        this.nombre = nombre;
        this.valor = valor;
        this.descripcion = descripcion;
        this.img = img;
    }
}

// Datos de las card de prod
const productos = [
    new Producto("Remera", 690, "Excelente estado", "../img/remera1.jpg"),
    new Producto("Remera", 566, "Excelente estado", "../img/remera2.jpg"),
    new Producto("Remera", 876, "Excelente estado", "../img/remera3.jpg"),
    new Producto("Remera", 1000, "Excelente estado", "../img/remera4.jpg"),
    new Producto("Remera", 790, "Excelente estado", "../img/remera5.jpg"),
    new Producto("Remera", 999, "Excelente estado", "../img/remera6.jpg"),
    new Producto("Remera", 899, "Excelente estado", "../img/remera7.jpg"),
    new Producto("Remera", 898, "Excelente estado", "../img/remera8.jpg"),
];


const mostrarProductos = (productosFiltrados) => {
    const contenedor = document.getElementById("contenedorProductos");

   // programacion defensiva 
    if (!contenedor) {
        console.error("Error: No se encontró el contenedor de productos.");
        return;
    }

    // limpieza de contador
    contenedor.innerHTML = ""; 

    
    if (!Array.isArray(productosFiltrados) || productosFiltrados.length === 0) {
        console.warn("Advertencia: No se encontraron productos.");
        contenedor.innerHTML = "<p>No se encontraron productos que coincidan con tu búsqueda.</p>";
        return;
    }

   
    productosFiltrados.forEach((producto) => {
      
        if (!producto.nombre || !producto.img || !producto.valor) {
            console.error("Error: Producto incompleto", producto);
            return;
        }

        const divProducto = document.createElement("div");
        divProducto.classList.add("product");
        divProducto.innerHTML = `
            <img src="${producto.img}" alt="Imagen de ${producto.nombre}">
            <h3>${producto.nombre.toUpperCase()}</h3>
            <p>$${producto.valor.toFixed(2)}</p>
            <button>AÑADIR A LA CARITO</button>
        `;
        contenedor.appendChild(divProducto);
    });
};


mostrarProductos(productos);
