
let productodetalle = JSON.parse(localStorage.getItem("productoseleccionado"));
    
function cargarproducto(){
    let parrafo = document.createElement("div");
    parrafo.innerHTML=`
        <img src="${productodetalle.imagen}" alt="">
        <h2>${productodetalle.nombre}</h2>
        <p>${productodetalle.precio}</p>
        <button onclick="sumarproducto()">+</button>
        <p id="cantidad">0</p>
        <button onclick="restarproducto()">-</button>
        <br><br>
        <button onclick="agregarproducto()">Agregar al carrito</button>
        `
    document.getElementById("producto").appendChild(parrafo);
}
cargarproducto();

let cantidad = 0
function sumarproducto(){
    if (cantidad < productodetalle.stock){
        cantidad=cantidad+1,
        document.getElementById("cantidad").innerText= cantidad;
    } 
    else{
        alert("No hay suficiente stock")
    }
}

function restarproducto(){
    if (cantidad > 0){
    cantidad=cantidad-1,
    document.getElementById("cantidad").innerText= cantidad;  
  }
}

function agregarproducto(){
    document.getElementById("agregarproducto").innerText=cantidad
}