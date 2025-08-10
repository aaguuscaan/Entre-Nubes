const menus = [
    {nombre: "Inicio", url: "index.html"},
    {nombre: "Contacto", url: "form.html"},
    {nombre: '<img src="carrito.svg" alt="Carrito">', url: "carrito.html"},
    {nombre: '<div class="carrito" id="agregarproducto"><p>0</p></div>', url: "#"}
]

function cargarmenu() {
    let enlaces = document.getElementById("ulmenu")
    for (const menu of menus) {
        let lista = document.createElement("li")
        lista.innerHTML = `<a href="${menu.url}">${menu.nombre}</a>`;
        enlaces.appendChild(lista);
    }
}

const productos = [
    {
        id: 1,
        nombre: "Juego de Sábanas Queen / Good Night - Good Vibes",
        imagen: "sabans-violeta.jpeg",
        precio: 55600,
            detalle: "Juego de sábanas de alta calidad, suave y duradero. 180 hilos. Color: Violeta",
        stock: 5
    },
    {
        id: 2,
        nombre: "Juego de Sábanas Queen / Good Night - Good Vibes",
        imagen: "sabanass.jpeg",
        precio: 55600,
        detalle: "Juego de sábanas de alta calidad, suave y duradero. 180 hilos. Color: Bordo",
        stock: 3
    },
    {
        id: 3,
        nombre: "Sabana Ajustable 2 plazas / Good Night - Good Vibes",
        imagen: "sabanaajustable.jpeg",
        precio: 55600,
        detalle: "Sabana ajustable de alta calidad, suave y duradera. 180 hilos. Color: Blanco",
        stock: 2
    },
    {
        id: 4,
        nombre: "Almohada memory foam - 1 unidad / Sensitive",
        imagen: "almohada.jpeg",
        precio: 50000,
        detalle: "Almohada de memory foam, se adapta a la forma de tu cabeza y cuello.",
        stock: 4
    },
    {
        id: 5,
        nombre: "Cubre Colchón / Highiene y Protección",
        imagen: "cubrecolchon.jpeg",
        precio: 60000,
        detalle: "Cubre colchón de alta calidad, suave y duradero. 180 hilos. Color: Blanco",
        stock: 6
    },
]   

function cargarproductos() {
    let contenedor = document.getElementById("boxproductos")
    contenedor.innerHTML = '';
    
    let mainProductos = document.createElement("div");
    mainProductos.id = "producto";
    
    for(const producto of productos){
        let productoDiv = document.createElement("div");
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <button onclick="verproducto('${producto.id}')">Comprar</button>
        `;
        mainProductos.appendChild(productoDiv);
    }
    
    contenedor.appendChild(mainProductos);
}

function verproducto(idproducto){
    const buscarproducto = productos.find(producto => producto.id === parseInt(idproducto))
    const enJSON = JSON.stringify(buscarproducto);
    localStorage.setItem("productoseleccionado", enJSON)
    window.location.href = "detalle.html"
}


function agregarproducto(){
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
   
    let productoExistente = carrito.find(item => item.id === productodetalle.id);
    
    if (productoExistente) {
        let nuevaCantidad = parseInt(productoExistente.cantidad) + cantidad;
        if (nuevaCantidad <= productodetalle.stock) {
            productoExistente.cantidad = nuevaCantidad;
        } else {
            alert("No hay suficiente stock");
            return;
        }
    } else {

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


function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let totalItems = carrito.reduce((total, item) => total + parseInt(item.cantidad), 0);
    
    let contadorElement = document.getElementById("agregarproducto");
    if (contadorElement) {
        contadorElement.innerHTML = `<p>${totalItems}</p>`;
    }
}

function buscarEnMenu() {
    const query = document.getElementById("buscadorMenu").value.trim().toLowerCase();
    if (!query) {
        alert("Ingresa un término de búsqueda");
        return;
    }
    const producto = productos.find(p => p.nombre.toLowerCase().includes(query));
    if (producto) {
        localStorage.setItem("productoseleccionado", JSON.stringify(producto));
        window.location.href = "detalle.html";
    } else {
        alert("Producto no encontrado");
    }
}

cargarmenu();
cargarproductos();
actualizarContadorCarrito();