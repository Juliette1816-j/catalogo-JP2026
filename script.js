"https://opensheet.elk.sh/1Cd2_fF394dI7IviGzBTbcozgRTTu6cHo3I8kqyBU7xA/MEDIAS_STOCK";

let productosGlobal = [];

fetch(API)
.then(r => r.json())
.then(datos => {

    productosGlobal = datos;

    mostrarProductos(datos);

});

function cambiarLogo(categoria){

    const logo =
    document.getElementById("logoCategoria");

    if(
        categoria === "Mujer" ||
    ){
        logo.src = "logo-rosa.png";
    }
    else{
        logo.src = "logo-negro.png";
    }
    else{
        logo.src = "logo-azul-rosa.png";
    }

}
function filtrar(categoria){

    cambiarLogo(categoria);

    if(categoria === "Todos"){

        mostrarProductos(productosGlobal);
        return;
    }

    const filtrados =
    productosGlobal.filter(
        p => p.CATEGORIA_VISUAL === categoria
    );

    mostrarProductos(filtrados);
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

        let estado = "";

        if(Number(p.STOCK) === 0){
            estado = "🔴 Agotado";
        }
        else if(Number(p.STOCK) <= 5){
            estado = "🟡 Últimas unidades";
        }
        else{
            estado = "🟢 Disponible";
        }

        contenedor.innerHTML += `

        <div class="card">

            <img src="${imagen}">

            <div class="info">

                <h3>${p.PRODUCTO}</h3>

                <p>${p.CATEGORIA}</p>

                <p class="precio">
                    ${p["VALOR VENTA"]}
                </p>

                <p>${estado}</p>

                <a
                class="boton"
                target="_blank"
                href="https://wa.me/573138368430?text=Hola quiero comprar ${encodeURIComponent(p.PRODUCTO)}">

                Comprar

                </a>

            </div>

        </div>
        `;
    });

}
