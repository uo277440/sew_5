class Fondo{
    constructor(nombrePais,nombreCapital,coordendasCapital){
        this.nombrePais=nombrePais;
        this.nombreCapital=nombreCapital
        this.coordendasCapital=coordendasCapital
    }
    datosAPI() {
        var contenedor = $('body');
        var flickrAPI = "https://api.flickr.com/services/rest/?jsoncallback=?";
        var apiKey = "e62b6576baa78066f8e22c2f580cdb0c";
        var latitud = this.coordendasCapital.split(';')[0];
        var longitud = this.coordendasCapital.split(';')[1];
    
        $.getJSON(flickrAPI, {
            method: "flickr.photos.search",
            api_key: apiKey,
            tags: "Nairobi",
            tagmode: "any",
            format: "json",
            per_page: 1,
            lon: '36.817223',
            lat: '-1.286389'
        })
        .done(function (data) {
            var primeraFoto = data.photos.photo[0];
            if (primeraFoto) {
                console.log("Entre");
    
                // Construir la URL de la imagen
                var url = "https://live.staticflickr.com/" + primeraFoto.server + "/" + primeraFoto.id + "_" + primeraFoto.secret + "_b.jpg";
    
                // Establecer la imagen como fondo del body con background-size: cover
                contenedor.css({
                    "background-image": "url('" + url + "')",
                    "background-size": "cover"
                });
            } else {
                console.log("No se encontraron fotos.");
            }
        })
        .fail(function (error) {
            console.error("Error al obtener datos de la API de Flickr:", error);
        });
    }
}