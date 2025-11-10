const menus = [
    {nombre: "Ingresar", url: "login.html"},
    {nombre: "Contacto", url: "form.html"},
    {nombre: '<img src="carrito.svg" alt="Carrito">', url: "carrito.html"},
    {nombre: '<div class="carrito" id="agregarproducto"><p>0</p></div>', url: "#"}
]


function cargarmenu() {
let enlaces = document.getElementById("ulmenu")
for (const menu of menus) {
let lista = document.createElement("li")
lista.innerHTML =`<a href=${menu.url}>${menu.nombre}</a>`;
enlaces.appendChild(lista);
}
}
cargarmenu()  
 
let productocarritos = JSON.parse(localStorage.getItem("carrito")) || [];

function cargarcarrito() {
    let tabla = document.getElementById("tablacarrito");
    tabla.innerHTML = ''; // Limpiar tabla
    
    if (productocarritos.length === 0) {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 2em;">
                Tu carrito está vacío
            </td>
        `;
        tabla.appendChild(fila);
        return;
    }
    
    let total = 0;
    
    for (const productocarrito of productocarritos) {
        let subtotal = parseInt(productocarrito.cantidad) * parseInt(productocarrito.precio);
        total += subtotal;
        
        let fila = document.createElement("tr");
        fila.id = `producto-${productocarrito.id}`;
        fila.innerHTML = `
            <td><img src="${productocarrito.imagen}" width="50" alt="${productocarrito.nombre}"></td>
            <td>
                <button onclick="cambiarCantidad(${productocarrito.id}, -1)">-</button>
                <span>${productocarrito.cantidad}</span>
                <button onclick="cambiarCantidad(${productocarrito.id}, 1)">+</button>
            </td>
            <td>${productocarrito.nombre}</td>
            <td>$${productocarrito.precio}</td>
            <td>$${subtotal}</td>
            <td><button class="btn-eliminar" onclick="eliminarproducto(${productocarrito.id})">Eliminar</button></td>
        `;
        tabla.appendChild(fila);
    }
    
    // Agregar fila del total
    let filaTotal = document.createElement("tr");
    filaTotal.innerHTML = `
        <td colspan="4" style="text-align: right; font-weight: bold;">Total:</td>
        <td style="font-weight: bold;">$${total}</td>
        <td></td>
    `;
    tabla.appendChild(filaTotal);
}

function cambiarCantidad(id, cambio) {
    let producto = productocarritos.find(p => p.id === id);
    if (producto) {
        let nuevaCantidad = parseInt(producto.cantidad) + cambio;
        
        if (nuevaCantidad <= 0) {
            eliminarproducto(id);
            return;
        }
        
        // Aquí podrías verificar el stock si tienes acceso a la información de productos
        producto.cantidad = nuevaCantidad;
        
        // Actualizar localStorage
        localStorage.setItem("carrito", JSON.stringify(productocarritos));
        
        // Recargar la tabla
        cargarcarrito();
    }
}

function eliminarproducto(id) {
    // Confirmar eliminación
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        productocarritos = productocarritos.filter(producto => producto.id !== id);
        localStorage.setItem("carrito", JSON.stringify(productocarritos));
        cargarcarrito();
    }
}

function vaciarCarrito() {
    if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
        localStorage.removeItem("carrito");
        productocarritos = [];
        cargarcarrito();
    }
}

function agregarproducto(){
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // Verificar si el producto ya está en el carrito
    let productoExistente = carrito.find(item => item.id === productodetalle.id);
    
    if (productoExistente) {
        // Si ya existe, actualizar la cantidad
        let nuevaCantidad = parseInt(productoExistente.cantidad) + cantidad;
        if (nuevaCantidad <= productodetalle.stock) {
            productoExistente.cantidad = nuevaCantidad;
        } else {
            alert("No hay suficiente stock");
            return;
        }
    } else {
        // Si no existe, agregar nuevo producto
        let productonuevo = {  
            id: productodetalle.id,
            nombre: productodetalle.nombre,
            cantidad: cantidad, 
            precio: productodetalle.precio, 
            imagen: productodetalle.imagen
        };
        carrito.push(productonuevo);
    }
    
    const enJSON = JSON.stringify(carrito);
    localStorage.setItem("carrito", enJSON);
    
    alert("Producto agregado al carrito");
    window.location.href = "carrito.html";
}   

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let totalItems = carrito.reduce((total, item) => total + parseInt(item.cantidad), 0);
    
    let contadorElement = document.getElementById("agregarproducto");
    if (contadorElement) {
        contadorElement.innerHTML = `<p>${totalItems}</p>`;
    }
}
// Inicializar carrito al cargar la página
cargarcarrito();
actualizarContadorCarrito();    