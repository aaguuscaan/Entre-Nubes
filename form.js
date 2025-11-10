const menus = [
    {nombre: "Inicio", url: "login.html"},
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

  function actualizarContadorCarrito() {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            let totalItems = carrito.reduce((total, item) => total + parseInt(item.cantidad), 0);
            
            let contadorElement = document.getElementById("agregarproducto");
            if (contadorElement) {
                contadorElement.innerHTML = `<p>${totalItems}</p>`;
            }
        }

document.addEventListener('DOMContentLoaded', function() {
  cargarmenu();                // <-- construir menú primero (crea #agregarproducto)
  actualizarContadorCarrito(); // <-- ahora sí, el elemento existe y se actualiza
});