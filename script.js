const API =
"https://https://opensheet.elk.sh/1Cd2_fF394dI7IviGzBTbcozgRTTu6cHo3I8kqyBU7xA/MEDIAS_STOCK";

fetch(API)
.then(r => r.json())
.then(datos => {

    const contenedor =
    document.getElementById("productos");

    datos.forEach(p => {

        let estado = "";

        if(Number(p.Stock) === 0){
            estado = "🔴 Agotado";
        } else if(Number(p.Stock) <= 5){
            estado = "🟡 Últimas unidades";
        } else {
            estado = "🟢 Disponible";
        }

        contenedor.innerHTML += `
        <div class="card">

            <img src="${p.Imagen}">

            <h3>${p.Producto}</h3>

            <p>${p.Diseño}</p>

            <p>$${Number(p.Precio).toLocaleString()}</p>

            <p>${estado}</p>

            <a
            href="https://wa.me/+573138368430?text=Hola,%20quiero%20comprar%20${encodeURIComponent(p.Producto)}%20${encodeURIComponent(p.Diseño)}"
            target="_blank">
            Comprar
            </a>

        </div>`;
    });
});
