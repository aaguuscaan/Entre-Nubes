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
        lista.innerHTML = `<a href="${menu.url}">${menu.nombre}</a>`;
        enlaces.appendChild(lista);
    }
}

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Importar Firebase ESM desde el CDN (no usar "bare" imports en el navegador)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz6LBlz7KiVUjqbzcZqF5pW_hehm6vmd4",
  authDomain: "entre-nubes-d6584.firebaseapp.com",
  projectId: "entre-nubes-d6584",
  storageBucket: "entre-nubes-d6584.firebasestorage.app",
  messagingSenderId: "938731125733",
  appId: "1:938731125733:web:126a61dab3a30d0b5c0d0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

try {
    await signInAnonymously(auth);
    // ahora ya puedes llamar a fetchProductsFromFirestore()
    fetchProductsFromFirestore();
} catch (err) {
    console.error('Auth error:', err);
}

// Añadir variable global para los productos
let productos = [];

// Ajustar cargarproductos para usar la variable 'productos'
function cargarproductos() {
    let contenedor = document.getElementById("boxproductos")
    contenedor.innerHTML = '';
    
    let mainProductos = document.createElement("div");
    mainProductos.id = "producto";
    
    for (const producto of productos) {
        let productoDiv = document.createElement("div");
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <button><span>Comprar</span></button>
        `;
        productoDiv.querySelector('button').addEventListener('click', () => verproducto(producto.id));
        mainProductos.appendChild(productoDiv);
    }
    
    contenedor.appendChild(mainProductos);
    
    // Re-inicializar el Intersection Observer después de cargar los productos
    if ('IntersectionObserver' in window) {
        initIntersectionObserver();
    }
}

function verproducto(idproducto){
    const buscarproducto = productos.find(producto => producto.id === parseInt(idproducto))
    const enJSON = JSON.stringify(buscarproducto);
    localStorage.setItem("productoseleccionado", enJSON) // Cambiado a productoseleccionado
    window.location.href = "detalle.html"
}

// Función para actualizar el contador del carrito
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

// ==================== SCROLL ANIMATIONS ====================

// Función para detectar cuando un elemento está visible
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Función principal de animación al hacer scroll
function handleScrollAnimations() {
    // Animar el título de productos destacados
    const titulo = document.querySelector('#productos-destacados h2');
    if (titulo && isElementInViewport(titulo)) {
        titulo.classList.add('scroll-reveal');
    }

    // Animar productos individuales
    const productos = document.querySelectorAll('#producto > div');
    productos.forEach((producto) => {
        if (isElementInViewport(producto)) {
            producto.classList.add('scroll-reveal');
        }
    });

    // Animar footer
    const footer = document.querySelector('footer');
    if (footer && isElementInViewport(footer)) {
        footer.classList.add('scroll-reveal');
    }
}

// ==================== SCROLL TO TOP BUTTON ====================
function createScrollToTopButton() {
    // Crear el botón si no existe
    if (!document.querySelector('.scroll-to-top')) {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(button);

        // Funcionalidad del botón
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mostrar/ocultar el botón según el scroll
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('show');
    } else {
        scrollButton.classList.remove('show');
    }
}

// ==================== PAGE LOADER ====================
function showPageLoader() {
    // Crear el loader si no existe
    if (!document.querySelector('.page-loader')) {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Entre Nubes</div>
            </div>
        `;
        document.body.prepend(loader);
    }
}

function hidePageLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 800); // Mostrar loader por al menos 800ms
    }
}

// ==================== PARALLAX EFFECT ====================
function handleParallax() {
    const heroImage = document.querySelector('#producto-img');
    if (heroImage) {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
}

// ==================== SMOOTH SCROLL FOR LINKS ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ==================== CONTADOR ANIMADO ====================
function animateCounter() {
    const counter = document.querySelector('.carrito p');
    if (counter) {
        const target = parseInt(counter.textContent) || 0;
        let current = 0;
        const increment = target / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 50);
    }
}

// ==================== INTERSECTION OBSERVER (más eficiente) ====================
function initIntersectionObserver() {
    // Configurar el observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-reveal');
                // Opcional: dejar de observar después de animar
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos
    const elementsToObserve = [
        ...document.querySelectorAll('#producto > div'),
        document.querySelector('#productos-destacados h2'),
        document.querySelector('footer')
    ].filter(el => el !== null);

    elementsToObserve.forEach(el => observer.observe(el));
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar loader
    showPageLoader();

    // Inicializar smooth scroll
    initSmoothScroll();

    // Inicializar Intersection Observer (mejor rendimiento que scroll)
    if ('IntersectionObserver' in window) {
        initIntersectionObserver();
    } else {
        // Fallback para navegadores antiguos
        window.addEventListener('scroll', handleScrollAnimations);
        handleScrollAnimations(); // Ejecutar una vez al cargar
    }

    // Crear botón scroll to top
    createScrollToTopButton();

    // Animar contador del carrito
    setTimeout(animateCounter, 1000);
});

// Eventos de scroll
window.addEventListener('scroll', function() {
    createScrollToTopButton();
    handleParallax();
});

// Ocultar loader cuando la página cargue completamente
window.addEventListener('load', hidePageLoader);

// ==================== ANIMACIÓN DE HOVER EN PRODUCTOS ====================
document.addEventListener('DOMContentLoaded', function() {
    const productos = document.querySelectorAll('#producto > div');
    
    productos.forEach(producto => {
        producto.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        producto.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

// ==================== ANIMACIÓN DE TYPING EN HERO ====================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Opcional: descomentar para efecto de escritura en el título hero
/*
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 50);
        }
    }, 1000);
});
*/

// Nueva función asíncrona para traer productos desde Firestore
async function fetchProductsFromFirestore() {
    try {
        const db = getFirestore(app);
        const snapshot = await getDocs(collection(db, 'productos')); // ajusta el nombre si tu colección es otro
        productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cargarproductos();
        actualizarContadorCarrito();
    } catch (error) {
        console.error('Error al obtener productos desde Firestore:', error);
    }
}

// Inicializar la página
cargarmenu();
// Reemplazado: obtener productos desde Firestore antes de renderizar
fetchProductsFromFirestore();
// actualizarContadorCarrito(); // ya se llama dentro de fetchProductsFromFirestore()
// Re-inicializar el observer después de cargar los productos
if ('IntersectionObserver' in window) {
    initIntersectionObserver();
}