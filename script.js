const API =
"https://opensheet.elk.sh/1Cd2_fF394dI7IviGzBTbcozgRTTu6cHo3I8kqyBU7xA/MEDIAS_STOCK";

fetch(API)
.then(r => r.json())
.then(datos => {

    const contenedor =
    document.getElementById("productos");

    datos.forEach(p => {

        let estado = "";

        if(Number(p.STOCK) === 0){
            estado = "🔴 Agotado";
        } else if(Number(p.STOCK) <= 5){
            estado = "🟡 Últimas unidades";
        } else {
            estado = "🟢 Disponible";
        }

        const imagen =
            p.IMAGENES
            ? p.IMAGENES.split(",")[0].trim()
            : "https://via.placeholder.com/300x300?text=Sin+Imagen";

        contenedor.innerHTML += `
        <div class="card">

            <img src="${imagen}" alt="${p.PRODUCTO}">

            <div class="info">

                <h3>${p.PRODUCTO}</h3>

                <p>${p.CATEGORIA}</p>

                <p><b>${p["VALOR VENTA"]}</b></p>

                <p>${estado}</p>

                <p>Stock: ${p.STOCK}</p>

                <a class="boton"
                target="_blank"
                href="https://wa.me/573138368430?text=Hola%20quiero%20comprar%20${encodeURIComponent(p.PRODUCTO)}">
                Comprar
                </a>

            </div>

        </div>`;
    });

});
