const API = "https://opensheet.elk.sh/1Cd2_fF394dI7IviGzBTbcozgRTTu6cHo3I8kqyBU7xA/MEDIAS_STOCK";

const LOGO_MEDIAS = "https://lh3.googleusercontent.com/d/19Tqu5sfgN26MqUu3A3CVpaohOPzivXHW";
const LOGO_JOYERIA = "https://lh3.googleusercontent.com/d/1rSFjBpnOpUPOSrIVZ1BkjcBXWUokA_b4";

const logos = {
"Hombre": "https://lh3.googleusercontent.com/d/19Tqu5sfgN26MqUu3A3CVpaohOPzivXHW",
"Mujer": "https://lh3.googleusercontent.com/d/1rSFjBpnOpUPOSrIVZ1BkjcBXWUokA_b4",
"Niño": "https://lh3.googleusercontent.com/d/1LF_JI852MojEs9PuUgRTII5bMYklZzBA",
"Niña": "https://lh3.googleusercontent.com/d/1LF_JI852MojEs9PuUgRTII5bMYklZzBA",
"Unisex": "https://lh3.googleusercontent.com/d/19Tqu5sfgN26MqUu3A3CVpaohOPzivXHW"
};

let productosGlobal = [];
let pedido = [];
let cantidades = {};
let botonActivo = null;

const contenedorProductos = document.getElementById("productos");
contenedorProductos.innerHTML = `<p class="estado-info">Cargando productos...</p>`;

fetch(API)
.then(r => r.json())
.then(datos => {
    productosGlobal = datos;
    mostrarProductos(datos);
})
.catch(() => {
    contenedorProductos.innerHTML = `<p class="estado-info">No se pudieron cargar los productos. Intenta recargar la página.</p>`;
});

function marcarActivo(boton){
    if(botonActivo) botonActivo.classList.remove("activo");
    if(boton){
        boton.classList.add("activo");
        botonActivo = boton;
    }else{
        botonActivo = null;
    }
}

function cambiarLogo(categoria){
    const logo = document.getElementById("logoCategoria");
    if(categoria === "Joyeria"){
        logo.src = LOGO_JOYERIA;
    }else{
        logo.src = LOGO_MEDIAS;
    }
}

function filtrar(categoria){
    cambiarLogo(categoria);

    if(categoria === "Todos"){
        mostrarProductos(productosGlobal);
        return;
    }

    const filtrados = productosGlobal.filter(p =>
        (p.CATEGORIA || "").toLowerCase().includes(categoria.toLowerCase())
    );

    mostrarProductos(filtrados);
}

document.addEventListener("input", (e) => {
    if(e.target.id === "buscador"){
        const texto = e.target.value.toLowerCase();
        const filtrados = productosGlobal.filter(p =>
            (p.PRODUCTO || "").toLowerCase().includes(texto)
        );
        mostrarProductos(filtrados);
    }
});

function filtrarCategoria(cat, btn){
    cambiarLogo(cat);
    marcarActivo(btn || (typeof event !== "undefined" ? event.currentTarget : null));

    if(cat === "Todos"){
        mostrarProductos(productosGlobal);
        return;
    }

    const filtrados = productosGlobal.filter(p =>
        (p.CATEGORIA || "").trim().toLowerCase() === cat.toLowerCase()
    );

    mostrarProductos(filtrados);
}

function agregar(nombre, precio, cantidad){
    const existe = pedido.find(p => p.nombre === nombre);

    if(existe){
        existe.cantidad += cantidad;
    }else{
        pedido.push({ nombre, precio, cantidad });
    }

    actualizarPedido();
    abrirPedido();
}
function eliminarProducto(nombre){
    pedido = pedido.filter(p => p.nombre !== nombre);
    actualizarPedido();
}

function actualizarPedido(){
    const lista = document.getElementById("listaPedido");
    lista.innerHTML = "";

    let totalItems = 0;
    let totalValor = 0;
    let mensaje = "Hola, deseo pedir:%0A";

    pedido.forEach(item => {
        totalItems += item.cantidad;
        totalValor += item.precio * item.cantidad;

        // FIX: clase correcta (.item-pedido, coincide con el CSS)
        // FIX: el botón ahora cierra bien la etiqueta de apertura antes del emoji
        lista.innerHTML += `
          <li class="item-pedido">
            <div>${item.nombre} x${item.cantidad}</div>
            <button class="btn-eliminar" onclick="eliminarProducto('${item.nombre.replace(/'/g, "\\'")}')">🗑️</button>
          </li>`;

        mensaje += `${item.nombre} x${item.cantidad}%0A`;
    });

    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("totalValor").textContent = totalValor.toLocaleString("es-CO");

    mensaje += `%0ATotal: $${totalValor.toLocaleString("es-CO")}`;

    document.getElementById("btnWhatsapp").href = `https://wa.me/573138368430?text=${mensaje}`;

    // Badge del carrito flotante
    document.getElementById("badgeCarrito").textContent = totalItems;
}

// ---- Drawer del carrito ----
function abrirPedido(){
    document.getElementById("pedidoPanel").classList.add("abierto");
    document.getElementById("overlayPedido").classList.add("visible");
}

function cerrarPedido(){
    document.getElementById("pedidoPanel").classList.remove("abierto");
    document.getElementById("overlayPedido").classList.remove("visible");
}

document.getElementById("btnCarritoFlotante").addEventListener("click", abrirPedido);
document.getElementById("btnCerrarPedido").addEventListener("click", cerrarPedido);
document.getElementById("overlayPedido").addEventListener("click", cerrarPedido);

function filtrarPublico(publico, btn){
    const logo = document.getElementById("logoCategoria");
    marcarActivo(btn || (typeof event !== "undefined" ? event.currentTarget : null));

    if(logos[publico]){
        logo.src = logos[publico];
    }

    if(publico === "Todos"){
        logo.src = LOGO_MEDIAS;
        mostrarProductos(productosGlobal);
        return;
    }

    const filtrados = productosGlobal.filter(p =>
        (p.PUBLICO || "").trim().toLowerCase() === publico.toLowerCase()
    );

    mostrarProductos(filtrados);
}

function cambiarCantidad(id, cambio){
    if(!cantidades[id]) cantidades[id] = 1;

    cantidades[id] += cambio;
    if(cantidades[id] < 1) cantidades[id] = 1;

    document.getElementById(`cantidad-${id}`).textContent = cantidades[id];
}

function obtenerPrecio(valor){
    return Number(
        valor.replace("$","").replace(/\./g,"").trim()
    );
}

function mostrarProductos(datos){
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    const visibles = datos.filter(p => Number((p.STOCK || "0").trim()) > 0);

    if(visibles.length === 0){
        contenedor.innerHTML = `<p class="estado-info">No se encontraron productos con ese criterio.</p>`;
        return;
    }

    datos.forEach((p,i) => {
        const stock = Number((p.STOCK || "0").trim());

        if(stock <= 0){
            return;
        }

        if(!cantidades[i]){
            cantidades[i] = 1;
        }

        let imagen = p.IMAGENES
            ? p.IMAGENES.split(",")[0].trim()
            : "https://via.placeholder.com/300";

        const match = imagen.match(/id=([^&]+)/);

        if(match){
            imagen = `https://lh3.googleusercontent.com/d/${match[1]}`;
        }

        let claseEstado = "disponible";
        let textoEstado = "✦ Disponible";

        if(stock <= 5){
            claseEstado = "ultimas";
            textoEstado = `✦ Últimas ${stock}`;
        }

        contenedor.innerHTML += `
        <div class="card">
            <div class="img-wrap">
                <img src="${imagen}" alt="${p.PRODUCTO}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=Sin+imagen'">
            </div>
            <div class="info">
                <h3>${p.PRODUCTO || ""}</h3>
                <div class="precio">${p["VALOR VENTA"] || ""}</div>
                <div class="estado ${claseEstado}">${textoEstado}</div>
                <div class="cantidad-box">
                    <button onclick="cambiarCantidad(${i},-1)">-</button>
                    <span id="cantidad-${i}">${cantidades[i]}</span>
                    <button onclick="cambiarCantidad(${i},1)">+</button>
                </div>
                <button class="btn-agregar" onclick="agregar(
                    '${(p.PRODUCTO || '').replace(/'/g, "\\'")}',
                    ${obtenerPrecio(p['VALOR VENTA'])},
                    cantidades[${i}]
                )">Agregar al pedido</button>
            </div>
        </div>
        `;
    });
}
