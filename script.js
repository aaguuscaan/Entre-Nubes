const productos = [
    {
        id: 1,
        nombre: "Jean Wide Leg",
        imagen: "wideleg1.jfif",
        precio: "5000",
        detalle: "",
        stock: 1
    },

    {
        id: 2,
        nombre: "Jean Chupin",
        imagen: "chupin.jfif",
        precio: "5000",
        detalle: "",
        stock: 1
    },

    {
        id: 3,
        nombre: "Jean Baggy",
        imagen: "baggy.jfif",
        precio: "5000",
        detalle: "",
        stock: 1
    },

    {
        id: 4,
        nombre: "Jean Baggy",
        imagen: "baggy2.jfif",
        precio: "5000",
        detalle: "",
        stock: 1
    },

    {
        id: 5,
        nombre: "Jean Wide Leg",
        imagen: "wideleg2.jfif",
        precio: "5000",
        detalle: "",
        stock: 1
    },
]

function cargarproducto() {
    for(const producto of productos){
        let parrafo= document.createElement("div");
    parrafo.innerHTML= `
        <img src="${producto.imagen}" alt="">
        <h2>${producto.nombre}</h2>
        <p>${producto.precio}</p>
        <button onclick="verproducto('${producto.id}')">Comprar</button>
    `
    document.getElementById("producto").appendChild(parrafo)
    }
}


cargarproducto()

function verproducto(idproducto){
    const buscarproducto = productos.find(producto => producto.id === parseInt(idproducto))
    let productojson =JSON.stringify(buscarproducto) 
    localStorage.setItem("productoseleccionado", productojson)
    window.location.href ="detalle.html";
}

