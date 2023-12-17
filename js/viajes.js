class Viajes{
    constructor (){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
        this.accessToken='pk.eyJ1IjoidW8yNzc0NDAiLCJhIjoiY2wyaXBhaGZkMDc4YjNqcW5qenY5MjFvOCJ9.0oTGSdJTHf7bwxxiK9jCKg';
        mapboxgl.accessToken = this.accessToken

        this.slides = null;
        this.nextSlideBtn = null;
        this.prevSlideBtn = null;
        this.curSlide = null;
        this.maxSlide = null;
    }
    init() {
        this.slides = document.querySelectorAll("img");
        this.nextSlideBtn = document.querySelector("button[data-action='next']");
        this.prevSlideBtn = document.querySelector("button[data-action='prev']");
        this.curSlide = 9;


        this.maxSlide = this.slides.length - 1;
    
        this.nextSlideBtn.addEventListener("click", this.nextSlide.bind(this));
        this.prevSlideBtn.addEventListener("click", this.prevSlide.bind(this));
      }
    
      nextSlide() {
        if (this.curSlide === this.maxSlide) {
          this.curSlide = 0;
        } else {
          this.curSlide++;
        }
    
        this.moveSlides();
      }
    
      prevSlide() {
        if (this.curSlide === 0) {
          this.curSlide = this.maxSlide;
        } else {
          this.curSlide--;
        }
    
        this.moveSlides();
      }
    
      moveSlides() {
        this.slides.forEach((slide, indx) => {
          var trans = 100 * (indx - this.curSlide);
          $(slide).css('transform', 'translateX(' + trans + '%)'); //permitido
        });
      }
    getPosicion(posicion){
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;       
    }
    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }
    getLongitud(){
        return this.longitud;
    }
    getLatitud(){
        return this.latitud;
    }
    getAltitud(){
        return this.altitud;
    }
    getMapaEstaticoMapbox() {
        
        var section = document.createElement('section')
        section.setAttribute("data-state",'mapa')
        var h2=document.createElement('h2')
        h2.textContent="Mapa estático"
        section.appendChild(h2)
        var body = document.querySelector('body')
        
        var url=`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${this.longitud},${this.latitud},14/500x300?access_token=${this.accessToken}`
        
        var img = document.createElement('img')
        img.setAttribute('src',url)
        img.setAttribute('alt','mapa estático Mapbox')
        
        section.appendChild (img)
        body.append(section)
        var primerBoton = document.querySelector('button')
        primerBoton.disabled = true
    }
    getMapaDinamicoMapbox() {   
        var body = document.querySelector('body');
        var section = document.createElement('section')
        var h2=document.createElement('h2')
        h2.textContent="Mapa dinámico"
        var aside = document.createElement('aside');
        section.setAttribute("data-state",'mapa')
        section.appendChild(h2);
        section.appendChild(aside);
        body.append(section)

        
            const map = new mapboxgl.Map({
                container: aside,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [this.longitud, this.latitud],
                zoom: 12
            });
           
        
            
            var segundoBoton = document.querySelector('button:nth-of-type(2)')
            segundoBoton.disabled = true

           
        }
        getMapaDinamicoMapboxKml(kmlFiles) {
            var body = document.querySelector('body');
            var section = document.createElement('section')
            var h2=document.createElement('h2')
            h2.textContent="Mapa dinámico con KML"
            var aside = document.createElement('aside');
            section.setAttribute("data-state",'mapa')
            section.appendChild(h2);
            section.appendChild(aside);
            body.append(section)
        
            const map = new mapboxgl.Map({
                container: aside,
                style: 'mapbox://styles/mapbox/streets-v11',
                zoom: 12
            });
        

        
            function handleFile(file) {
                var reader = new FileReader();
                
                reader.onload = function (e) {
                    var kmlData = e.target.result;
                    var arrayKML = []
                    
                    $(kmlData).find('Placemark').each(function () {
                        var name = $(this).find('name').text();
                        var coordinates = $(this).find('coordinates').text().split(',');
                        var longitude = parseFloat(coordinates[0]);
                        var latitude = parseFloat(coordinates[1]);

                         map.setCenter([longitude, latitude]);
                         arrayKML.push([longitude,latitude])
                        
                        
                    });
                    var primero = arrayKML[0]
                    arrayKML.push(primero)
                    map.on('load', () => {
                        var id  = 'maine'+Math.random()
                        // Add a data source containing GeoJSON data.
                        map.addSource(id, {
                        'type': 'geojson',
                        'data': {
                        'type': 'Feature',
                        'geometry': {
                        'type': 'Polygon',
                        // These coordinates outline Maine.
                        'coordinates': [
                            arrayKML
                        ]
                        }
                        }
                        });
                         
                        // Add a new layer to visualize the polygon.
                        map.addLayer({
                        'id': id,
                        'type': 'fill',
                        'source': id, // reference the data source
                        'layout': {},
                        'paint': {
                        'fill-color': '#0080ff', // blue color fill
                        'fill-opacity': 0.5
                        }
                        });
                        // Add a black outline around the polygon.
                        map.addLayer({
                        'id': 'outline'+Math.random(),
                        'type': 'line',
                        'source': id,
                        'layout': {},
                        'paint': {
                        'line-color': '#000',
                        'line-width': 3
                        }
                        });
                        });
                };
        
                reader.readAsText(file);
            }
            const files = kmlFiles.files;
                for (var i = 0; i < files.length; i++) {
                    handleFile(files[i]);
                }
        }
        procesarSVGS(input) {
            const files = input.files;
    
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
    
                if (file.type.match('image/svg')) {
                    this.leerYMostrarSVG(file);
                } else {
                    console.log('Error: El archivo no es un SVG.');
                }
            }
        }
    
        leerYMostrarSVG(file) {
            const reader = new FileReader();
    
            reader.onload = (e) => {
                const svgContent = e.target.result;
                var h2 = $('<h2>').text($(svgContent).find('title').text())
               
                const article = $('<article>');
                article.append(h2)
                article.append(svgContent)
                
              
                $('body').append(article);
            };
    
            reader.readAsText(file);
        }
    
    leerArchivoTexto(fileInput) { 
        
      var tipoTexto = /xml.*/;
      const archivo = fileInput.files[0];
      if (archivo.type.match(tipoTexto)) 
        {
          var lector = new FileReader();
          lector.onload = function (evento) {
            var xml = evento.target.result;
            const $xml = $(xml);
            $xml.find('ruta').each(function () {
                const $ruta = $(this);
                const $article = $('<article>');

                $article.append(`<h2>${$ruta.attr('nombre')}</h2>`);
                $article.append(`<p>Descripción de la ruta: ${$ruta.attr('descripcion')}</p>`);
                $article.append(`<p>Duración de la ruta: ${$ruta.attr('duracion')}</p>`);
                $article.append(`<p>Personas adecuadas: ${$ruta.attr('personasAdecuadas')}</p>`);
                $article.append(`<p>Medio de transporte: ${$ruta.attr('medioTransporte')}</p>`);

                const $ul = $('<ul>');
                $ul.append(`<li>Tipo de Ruta: ${$ruta.find('tipoRuta').text()}</li>`);
                $ul.append(`<li>Medio de Transporte: ${$ruta.find('medioTransporte').text()}</li>`);
                $ul.append(`<li>Fecha de Inicio: ${$ruta.find('fechaInicio').text()}</li>`);
                $ul.append(`<li>Hora de Inicio: ${$ruta.find('horaInicio').text()}</li>`);
                $article.append($ul);

                const $coordenadas = $ruta.find('coordenadasInicio');
                $article.append(`<h3>Coordenadas de Inicio</h3>`);
                $article.append(`<p>Longitud: ${$coordenadas.find('longitud').text()}</p>`);
                $article.append(`<p>Latitud: ${$coordenadas.find('latitud').text()}</p>`);
                $article.append(`<p>Altitud: ${$coordenadas.find('altitud').text()}m</p>`);
                

                
                const $hitos = $ruta.find('hito');
                $article.append('<h3>Hitos</h3>');
                const $ulHitos = $('<ul>');
                $hitos.each(function() {
                    const $hito = $(this);
                    const $liHito = $('<li>');
                    $liHito.append(`<p>Nombre: ${$hito.attr('nombre')}</p>`);
                    $liHito.append(`<p>Descripción: ${$hito.attr('descripcion')}</p>`);

                    const $coordenadasHito = $hito.find('coordenadas');
                    $liHito.append(`<p>Longitud: ${$coordenadasHito.find('longitud').text()}</p>`);
                    $liHito.append(`<p>Latitud: ${$coordenadasHito.find('latitud').text()}</p>`);
                    $liHito.append(`<p>Altitud: ${$coordenadasHito.find('altitud').text()}m</p>`);

                    const $fotosHito = $hito.find('fotoHito');
                    if ($fotosHito.length > 0) {
                        $liHito.append('<p>Fotos:</p>');
                        const $ulFotos = $('<ul>');
                        $fotosHito.each(function() {
                            const $foto = $(this);
                            const $img = $('<img>').attr({'src': $foto.text(),'alt': $hito.attr('nombre')});
                            $ulFotos.append($('<li>').append($img));
                        });
                        $liHito.append($ulFotos);
                    }

                    const $videosHito = $hito.find('videoHito');
                    if ($videosHito.length > 0) {
                        $liHito.append('<p>Videos:</p>');
                        const $ulVideos = $('<ul>');
                        $videosHito.each(function() {
                            const $video = $(this);
                            $ulVideos.append(`<li>${$video.text()}</li>`);
                        });
                        $liHito.append($ulVideos);
                    }

                    $ulHitos.append($liHito);
                });

                $article.append($ulHitos);
                $('body').append($article);
            });
            }      
            
          lector.readAsText(archivo);
          
          }
      else {
          alert("Error : ¡¡¡ Archivo no válido !!!")
          }       
  }
}