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

const producto = JSON.parse(localStorage.getItem("productoDetalle"));
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
        let productoActual = null;
        let cantidad = 1;


        function mostrarAlerta(tipo, titulo, mensaje, callback = null, mostrarCancelar = false) {
            const overlay = document.getElementById('alertOverlay');
            const box = document.getElementById('alertBox');
            const icon = document.getElementById('alertIcon');
            const titleEl = document.getElementById('alertTitle');
            const messageEl = document.getElementById('alertMessage');
            const confirmBtn = document.getElementById('alertConfirm');
            const cancelBtn = document.getElementById('alertCancel');

            let iconSymbol = '';
            switch(tipo) {
                case 'success':
                    iconSymbol = '✓';
                    box.className = 'alert-box alert-success';
                    break;
                case 'error':
                    iconSymbol = '✗';
                    box.className = 'alert-box alert-error';
                    break;
                case 'warning':
                    iconSymbol = '⚠';
                    box.className = 'alert-box alert-warning';
                    break;
                default:
                    iconSymbol = 'ℹ';
                    box.className = 'alert-box';
            }

            icon.textContent = iconSymbol;
            titleEl.textContent = titulo;
            messageEl.textContent = mensaje;


            cancelBtn.style.display = mostrarCancelar ? 'inline-block' : 'none';

            confirmBtn.onclick = () => {
                cerrarAlerta();
                if (callback) callback(true);
            };

            cancelBtn.onclick = () => {
                cerrarAlerta();
                if (callback) callback(false);
            };

            overlay.classList.add('show');
        }

        function cerrarAlerta() {
            const overlay = document.getElementById('alertOverlay');
            overlay.classList.remove('show');
        }

        function cargarProductoPrincipal() {

            const productoGuardado = localStorage.getItem("productoseleccionado");
            if (productoGuardado) {
                productoActual = JSON.parse(productoGuardado);
            } else {
                productoActual = productos[0];
            }

            const container = document.getElementById('producto-principal');
            container.innerHTML = `
                <div class="producto-imagen">
                    <img src="${productoActual.imagen}" alt="${productoActual.nombre}">
                </div>
                <div class="producto-info">
                    <h1>${productoActual.nombre}</h1>
                    <div class="producto-precio">$${productoActual.precio}</div>
                    <div class="producto-descripcion">${productoActual.detalle}</div>
                    <div class="cantidad-controls">
                        <button onclick="restarCantidad()">-</button>
                        <span class="cantidad-display" id="cantidad">${cantidad}</span>
                        <button onclick="sumarCantidad()">+</button>
                    </div>
                    <button class="btn-agregar-carrito" onclick="agregarAlCarrito()">
                        Agregar al Carrito
                    </button>
                </div>
            `;
        }


        function cargarProductosDestacados() {
            const container = document.getElementById('productos-destacados');
            
            const productosDestacados = productos.filter(p => p.id !== productoActual.id);
            
            container.innerHTML = '';
            
            productosDestacados.forEach(producto => {
                const productoCard = document.createElement('div');
                productoCard.className = 'producto-card';
                productoCard.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <div class="precio">$${producto.precio}</div>
                    <button onclick="productoseleccionados(${producto.id})">Ver Detalle</button>
                `;
                container.appendChild(productoCard);
            });
        }

        function productoseleccionados(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
        localStorage.setItem("productoseleccionado", JSON.stringify(producto));
        window.location.href = "detalle.html";
    }
}


        function sumarCantidad() {
            if (cantidad < productoActual.stock) {
                cantidad++;
                document.getElementById('cantidad').textContent = cantidad;
            } else {
                mostrarAlerta('warning', 'Stock Limitado', 'No hay suficiente stock disponible.');
            }
        }

        function restarCantidad() {
            if (cantidad > 1) {
                cantidad--;
                document.getElementById('cantidad').textContent = cantidad;
            }
        }

        function agregarAlCarrito() {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            
    
            let productoExistente = carrito.find(item => item.id === productoActual.id);
            
            if (productoExistente) {
                let nuevaCantidad = parseInt(productoExistente.cantidad) + cantidad;
                if (nuevaCantidad <= productoActual.stock) {
                    productoExistente.cantidad = nuevaCantidad;
                } else {
                    mostrarAlerta('error', 'Stock Insuficiente', 'No hay suficiente stock para agregar esta cantidad.');
                    return;
                }
            } else {
                let productoNuevo = {
                    id: productoActual.id,
                    nombre: productoActual.nombre,
                    cantidad: cantidad,
                    precio: productoActual.precio,
                    imagen: productoActual.imagen
                };
                carrito.push(productoNuevo);
            }
            
            
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContadorCarrito();
            
            mostrarAlerta('success', '¡Producto Agregado!', 'El producto se agregó correctamente al carrito.', (confirma) => {
                if (confirma) {
                    window.location.href = "carrito.html";
                }
            });
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

        document.addEventListener('DOMContentLoaded', function() {
  cargarmenu();           
  cargarProductoPrincipal();
  cargarProductosDestacados();
  actualizarContadorCarrito(); 
});