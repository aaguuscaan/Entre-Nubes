import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// ==================== CARGAR MENÚ ====================
const menus = [
    {nombre: "Ingresar", url: "login.html"},
    {nombre: "Contacto", url: "form.html"},
    {nombre: '<img src="carrito.svg" alt="Carrito">', url: "carrito.html"},
    {nombre: '<div class="carrito" id="agregarproducto"><p>0</p></div>', url: "#"}
];

function cargarmenu() {
    let enlaces = document.getElementById("ulmenu");
    for (const menu of menus) {
        let lista = document.createElement("li");
        lista.innerHTML = `<a href="${menu.url}">${menu.nombre}</a>`;
        enlaces.appendChild(lista);
    }
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

// Inicializar menú cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarmenu();
    actualizarContadorCarrito();
});

// ==================== FIREBASE CONFIGURATION ====================
const firebaseConfig = {
  apiKey: "AIzaSyCz6LBlz7KiVUjqbzcZqF5pW_hehm6vmd4",
  authDomain: "entre-nubes-d6584.firebaseapp.com",
  projectId: "entre-nubes-d6584",
  storageBucket: "entre-nubes-d6584.firebasestorage.app",
  messagingSenderId: "938731125733",
  appId: "1:938731125733:web:126a61dab3a30d0b5c0d0c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==================== ELEMENTOS DEL DOM ====================
let btnIniciar, btnRegistrarse, verPassword, confirmarLabel, inputConfirmar, boxLogin;

// Estado: true = modo registro, false = modo login
let modoRegistro = false;

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos
    btnIniciar = document.getElementById("btniniciar");
    btnRegistrarse = document.getElementById("btnregistrarse");
    verPassword = document.getElementById("verpassword");
    confirmarLabel = document.getElementById("confirmar");
    inputConfirmar = document.getElementById("inpconfirmar");
    boxLogin = document.getElementById("boxlogin");

    // ==================== MOSTRAR/OCULTAR CONTRASEÑA ====================
    verPassword.addEventListener("change", function() {
        const tipo = this.checked ? "text" : "password";
        document.getElementById("inppassword").type = tipo;
        if (inputConfirmar) {
            inputConfirmar.type = tipo;
        }
    });

    // ==================== CAMBIAR ENTRE LOGIN Y REGISTRO ====================
    btnRegistrarse.addEventListener("click", function(e) {
        e.preventDefault();
        modoRegistro = !modoRegistro;
        
        if (modoRegistro) {
            // Modo REGISTRO
            confirmarLabel.style.display = "block";
            inputConfirmar.style.display = "block";
            inputConfirmar.required = true;
            btnRegistrarse.innerHTML = "<span>Volver a Iniciar Sesión</span>";
            btnIniciar.innerHTML = "<span>Crear Cuenta</span>";
        } else {
            // Modo LOGIN
            confirmarLabel.style.display = "none";
            inputConfirmar.style.display = "none";
            inputConfirmar.required = false;
            btnRegistrarse.innerHTML = "<span>Registrarse</span>";
            btnIniciar.innerHTML = "<span>Iniciar Sesión</span>";
        }
    });

    // ==================== MANEJAR ENVÍO DEL FORMULARIO ====================
    boxLogin.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const email = document.getElementById("inpemail").value.trim();
        const password = document.getElementById("inppassword").value;
        const confirmarPassword = inputConfirmar.value;
        
        // Validaciones básicas
        if (!email || !password) {
            alert("Por favor completa todos los campos");
            return;
        }
        
        try {
            if (modoRegistro) {
                // ========== MODO REGISTRO ==========
                
                // Validar que las contraseñas coincidan
                if (password !== confirmarPassword) {
                    alert("Las contraseñas no coinciden");
                    return;
                }
                
                // Validar longitud de contraseña
                if (password.length < 6) {
                    alert("La contraseña debe tener al menos 6 caracteres");
                    return;
                }
                
                // Crear usuario en Firebase
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                alert("¡Usuario registrado exitosamente!\n" + userCredential.user.email);
                
                // Volver a modo login después del registro exitoso
                modoRegistro = false;
                confirmarLabel.style.display = "none";
                inputConfirmar.style.display = "none";
                inputConfirmar.required = false;
                btnRegistrarse.innerHTML = "<span>Registrarse</span>";
                btnIniciar.innerHTML = "<span>Iniciar Sesión</span>";
                
                // Limpiar formulario
                boxLogin.reset();
                
            } else {
                // ========== MODO LOGIN ==========
                
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                alert(`¡Bienvenido ${user.email}!`);
                
                // Redirigir al panel de control o a la página principal
                window.location.href = "index.html";
            }
            
        } catch (error) {
            console.error("Error completo:", error);
            
            // Mensajes de error más amigables
            let mensaje = "Error: ";
            switch(error.code) {
                case 'auth/email-already-in-use':
                    mensaje += "Este correo ya está registrado. Intenta iniciar sesión.";
                    break;
                case 'auth/invalid-email':
                    mensaje += "El correo electrónico no es válido";
                    break;
                case 'auth/weak-password':
                    mensaje += "La contraseña es muy débil. Usa al menos 6 caracteres.";
                    break;
                case 'auth/user-not-found':
                    mensaje += "No existe una cuenta con este correo";
                    break;
                case 'auth/wrong-password':
                    mensaje += "Contraseña incorrecta";
                    break;
                case 'auth/invalid-credential':
                    mensaje += "Credenciales inválidas. Verifica tu correo y contraseña.";
                    break;
                case 'auth/too-many-requests':
                    mensaje += "Demasiados intentos fallidos. Intenta más tarde.";
                    break;
                default:
                    mensaje += error.message;
            }
            
            alert(mensaje);
        }
    });

    // Asegurar que los campos estén ocultos al inicio
    confirmarLabel.style.display = "none";
    inputConfirmar.style.display = "none";
    inputConfirmar.required = false;
});