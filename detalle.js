// Importar Firebase ESM desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const menus = [
    {nombre: "Login", url: "login.html"},
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

// Configuración Firebase (igual que en script.js)
const firebaseConfig = {
  apiKey: "AIzaSyCz6LBlz7KiVUjqbzcZqF5pW_hehm6vmd4",
  authDomain: "entre-nubes-d6584.firebaseapp.com",
  projectId: "entre-nubes-d6584",
  storageBucket: "entre-nubes-d6584.firebasestorage.app",
  messagingSenderId: "938731125733",
  appId: "1:938731125733:web:126a61dab3a30d0b5c0d0c"
};

// Inicializar Firebase (no arrojará error si ya está inicializada en otra pestaña)
const app = initializeApp(firebaseConfig);

// Fallback local (si Firestore no responde o hay permisos)
let productos = [
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
];

let productoActual = null;
let cantidad = 1;

// Mostrar alertas (misma implementación que tenías)
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

// Cargar producto principal desde localStorage o desde productos cargados
function cargarProductoPrincipal() {
    const productoGuardado = localStorage.getItem("productoseleccionado");
    if (productoGuardado && productoGuardado !== 'undefined') {
        try {
            productoActual = JSON.parse(productoGuardado);
        } catch (e) {
            console.warn('productoseleccionado no es JSON válido, se ignora:', productoGuardado, e);
            productoActual = null;
        }
        // Si el id viene como string, intentar mapear con productos obtenidos
        if (productoActual && productos && productos.length) {
            const encontrado = productos.find(p => p.id.toString() === productoActual.id.toString());
            if (encontrado) productoActual = encontrado;
        }
    } else {
        productoActual = null;
    }

    if (!productoActual) {
        productoActual = productos[0] || null;
    }

    const container = document.getElementById('producto-principal');
    if (!container || !productoActual) return;

    container.innerHTML = `
        <div class="producto-imagen">
            <img src="${productoActual.imagen}" alt="${productoActual.nombre}">
        </div>
        <div class="producto-info">
            <h1>${productoActual.nombre}</h1>
            <div class="producto-precio">$${productoActual.precio}</div>
            <div class="producto-descripcion">${productoActual.detalle || productoActual.description || ''}</div>
            <div class="cantidad-controls">
                <button id="btn-restar">-</button>
                <span class="cantidad-display" id="cantidad">${cantidad}</span>
                <button id="btn-sumar">+</button>
            </div>
            <button class="btn-agregar-carrito" id="btn-agregar">
                Agregar al Carrito
            </button>
        </div>
    `;

    document.getElementById('btn-sumar').addEventListener('click', sumarCantidad);
    document.getElementById('btn-restar').addEventListener('click', restarCantidad);
    document.getElementById('btn-agregar').addEventListener('click', agregarAlCarrito);
}

// Cargar productos destacados (excluye productoActual)
function cargarProductosDestacados() {
    const container = document.getElementById('productos-destacados');
    if (!container) return;
    const destacados = productos.filter(p => !productoActual || p.id !== productoActual.id);
    container.innerHTML = '';
    destacados.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <div class="precio">$${producto.precio}</div>
            <button data-id="${producto.id}">Ver Detalle</button>
        `;
        productoCard.querySelector('button').addEventListener('click', () => {
            localStorage.setItem("productoseleccionado", JSON.stringify(producto));
            window.location.href = "detalle.html";
        });
        container.appendChild(productoCard);
    });
}

function sumarCantidad() {
    if (cantidad < (productoActual.stock || 9999)) {
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
        if (nuevaCantidad <= (productoActual.stock || Infinity)) {
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
        if (confirma) window.location.href = "carrito.html";
    });
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let totalItems = carrito.reduce((total, item) => total + parseInt(item.cantidad), 0);
    let contadorElement = document.getElementById("agregarproducto");
    if (contadorElement) contadorElement.innerHTML = `<p>${totalItems}</p>`;
}

// Cargar productos desde Firestore (si las reglas lo permiten), si falla usar fallback local
async function loadProductsFromFirestore() {
    try {
        const auth = getAuth(app);
        // Intentar iniciar sesión anónima solo si está disponible; si falla, capturarlo y usar fallback.
        try {
            await signInAnonymously(auth);
        } catch (authErr) {
            console.warn('No se pudo autenticar de forma anónima:', authErr);
            // Si la causa es que la autenticación anónima está deshabilitada, el fetch podrá fallar por permisos.
            // Continúo y dejo que el siguiente getDocs falle y sea capturado por el catch exterior.
        }

        const db = getFirestore(app);
        const snapshot = await getDocs(collection(db, 'productos'));
        // mapear id (si firestore devuelve campos con tipos distintos)
        productos = snapshot.docs.map(doc => {
            const data = doc.data();
            return { id: isNaN(Number(doc.id)) ? doc.id : Number(doc.id), ...data };
        });
        console.log('Productos cargados desde Firestore:', productos.length);
    } catch (err) {
        // Mensaje más claro sobre la causa probable
        console.warn('No se pudieron cargar productos desde Firestore, usando fallback local. Error:', err);
        console.warn('Soluciones: 1) Habilitar Anonymous sign-in en Firebase Console, 2) Ajustar Firestore Rules para permitir lectura en desarrollo, o 3) Proveer datos locales/fallback.');
        // conservar array local definido arriba
    }
}

// Inicialización de la página
document.addEventListener('DOMContentLoaded', async function() {
    cargarmenu();
    await loadProductsFromFirestore();
    cargarProductoPrincipal();
    cargarProductosDestacados();
    actualizarContadorCarrito();
});