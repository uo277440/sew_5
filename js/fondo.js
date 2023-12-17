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
        var latitud = this.coordendasCapital.split(';')[1];
        var longitud = this.coordendasCapital.split(';')[0];
    
        $.getJSON(flickrAPI, {
            method: "flickr.photos.search",
            api_key: apiKey,
            tags: "Nairobi",
            tagmode: "any",
            format: "json",
            dataType: "json",
            per_page: 1,
            lon: longitud,
            lat: latitud
        })
        .done(function (data) {
            var primeraFoto = data.photos.photo[0];
            if (primeraFoto) {
                console.log("Entre");
    
                
                var url = "https://live.staticflickr.com/" + primeraFoto.server + "/" + primeraFoto.id + "_" + primeraFoto.secret + "_b.jpg";
    
                
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