const API = "https://opensheet.elk.sh/1Cd2_fF394dI7IviGzBTbcozgRTTu6cHo3I8kqyBU7xA/MEDIAS_STOCK";

const LOGO_MEDIAS = "https://lh3.googleusercontent.com/d/19Tqu5sfgN26MqUu3A3CVpaohOPzivXHW";
const LOGO_JOYERIA = "https://lh3.googleusercontent.com/d/1rSFjBpnOpUPOSrIVZ1BkjcBXWUokA_b4";

const logos = {

"Hombre":
"https://lh3.googleusercontent.com/d/19Tqu5sfgN26MqUu3A3CVpaohOPzivXHW",

"Mujer":
"https://lh3.googleusercontent.com/d/1rSFjBpnOpUPOSrIVZ1BkjcBXWUokA_b4",

"Niño":
"https://lh3.googleusercontent.com/d/1LF_JI852MojEs9PuUgRTII5bMYklZzBA",

"Niña":
"https://lh3.googleusercontent.com/d/1LF_JI852MojEs9PuUgRTII5bMYklZzBA",

"Unisex":
"https://lh3.googleusercontent.com/d/1LF_JI852MojEs9PuUgRTII5bMYklZzBA"
};

let productosGlobal = [];
let pedido = {};

fetch(API)
.then(r => r.json())
.then(datos => {
    productosGlobal = datos;
    mostrarProductos(datos);
});

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
        (p.CATEGORIA || "")
        .toLowerCase()
        .includes(categoria.toLowerCase())
    );

    mostrarProductos(filtrados);
}

document.addEventListener("input", (e) => {

    if(e.target.id === "buscador"){

        const texto =
        e.target.value.toLowerCase();

        const filtrados =
        productosGlobal.filter(p =>
            (p.PRODUCTO || "")
            .toLowerCase()
            .includes(texto)
        );

        mostrarProductos(filtrados);
    }

});

function agregar(nombre){

    if(!pedido[nombre]){
        pedido[nombre] = 0;
    }

    pedido[nombre]++;

    actualizarPedido();
}

function actualizarPedido(){

    const lista =
    document.getElementById("listaPedido");

    lista.innerHTML = "";

    let totalItems = 0;

    let mensaje =
    "Hola, deseo pedir:%0A";

    Object.entries(pedido).forEach(([nombre,cantidad]) => {

        totalItems += cantidad;

        lista.innerHTML += `
        <li>
            ${nombre} x${cantidad}
        </li>`;

        mensaje +=
        `${nombre} x${cantidad}%0A`;

    });

    document.getElementById("totalItems")
    .textContent = totalItems;

    document.getElementById("btnWhatsapp")
    .href =
    `https://wa.me/573138368430?text=${mensaje}`;
}

function mostrarProductos(datos){

    const contenedor =
    document.getElementById("productos");

    contenedor.innerHTML = "";

    datos.forEach(p => {

        let imagen =
        p.IMAGENES
        ? p.IMAGENES.split(",")[0].trim()
        : "https://via.placeholder.com/300";

        const match =
        imagen.match(/id=([^&]+)/);

        if(match){
            imagen =
            `https://lh3.googleusercontent.com/d/${match[1]}`;
        }

        const stock =
        Number(p.STOCK || 0);

        let claseEstado =
        "disponible";

        let textoEstado =
        "✔ Disponible";

        if(stock === 0){

            claseEstado =
            "agotado";

            textoEstado =
            "✖ Agotado";

        }else if(stock <= 5){

            claseEstado =
            "ultimas";

            textoEstado =
            `⚠ Últimas unidades ${stock}`;

        }

        contenedor.innerHTML += `

        <div class="card">

            <img
                src="${imagen}"
                alt="${p.PRODUCTO}">

            <div class="info">

                <h3>Público</h3>
                <div class="tags">
                    <span class="tag categoria">
                        ${p.CATEGORIA}
                    </span>
                
                    <span class="tag publico">
                        ${p.PUBLICO}
                    </span>
                </div>
                
                <h3>${p.PRODUCTO}</h3>

                <div class="precio">
                    ${p["VALOR VENTA"] || ""}
                </div>

                <div class="estado ${claseEstado}">
                    ${textoEstado}
                </div>
                
                <a
                    href="#"
                    class="comprar"
                    onclick="agregar('${(p.PRODUCTO || '').replace(/'/g,'')}'); return false;">

                    Agregar al pedido

                </a>

            </div>

        </div>
        `;
    });
}
