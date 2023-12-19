<?php

class Moneda {
    private $apiKey;
    private $fromCurrency;
    private $toCurrency;


    public function __construct($fromCurrency,$toCurrency) {
        $this->apiKey = '2c2abb494ebf5a2509810563';
        $this->fromCurrency = $fromCurrency;
        $this->toCurrency = $toCurrency; 
    }

    public function conversion() {
        $url = "https://open.er-api.com/v6/latest/{$this->fromCurrency}";
    
        $params = array(
            'apikey' => $this->apiKey,
        );
    
        $url .= '?' . http_build_query($params);
    
        $response = file_get_contents($url);
    
        if ($response === false) {
            return false; 
        }
    
        $exchangeRates = json_decode($response, true);
    
        if (isset($exchangeRates['rates'][$this->toCurrency])) {
            $baseCurrencyEquivalent = 1 / $exchangeRates['rates'][$this->toCurrency];
            return $baseCurrencyEquivalent;
        } else {
            return false; 
        }
    }

    
}

?>
<?php
class Carrusel {
    
    private $nombrePais;
    private $nombreCapital;

    public function __construct($nombrePais, $nombreCapital) {
        $this->nombrePais = $nombrePais;
        $this->nombreCapital = $nombreCapital;
    }
    
#
# crear la URL de la API que se va a llamar
#
function llamadaApi(){
    $params = array(
        'api_key'	=> 'e62b6576baa78066f8e22c2f580cdb0c',
        'method'	=> 'flickr.photos.search',
        'tags'      => $this->nombreCapital,
        'format'	=> 'php_serial',
    );

    $encoded_params = array();

    foreach ($params as $k => $v){

        $encoded_params[] = urlencode($k).'='.urlencode($v);
    }

    #
    # llamar a la API y decodificar la respuesta
    #

    $url = "https://api.flickr.com/services/rest/?".implode('&', $encoded_params);

    $rsp = file_get_contents($url);

    $rsp_obj = unserialize($rsp);

    if (isset($rsp_obj['photos']['photo'])) {
        return array_slice($rsp_obj['photos']['photo'], 0, 10);

    } else {
        echo 'No se encontraron fotos.';
    }
}
}

?>
<!DOCTYPE HTML>
<html lang="es">
<head>
	<meta name ="author" content ="Lucas Martínez Rego" />
	<meta name ="description" content ="aquí cada documento debe tener la
	descripción del contenido concreto del mismo" />
	<meta name ="keywords" content ="aquí cada documento debe tener la lista
	de las palabras clave del mismo separadas por comas" />
	<meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/viajes.css" />
    <link rel="icon" href="../multimedia/favicon.ico"/>
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet">
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js'></script>
	<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
	<script src="../js/viajes.js"></script>
    <title>Escritorio Virtual</title>
	
</head>

<body>
    <header>
		<h1>Viajes</h1>
		<nav>
			 <a tabindex="1" accesskey="I" href="../index.html">Inicio</a>
			 <a tabindex="2" accesskey="S" href="../sobremi.html">Sobre mi</a>
			 <a tabindex="3" accesskey="A" href="../agenda.html">Agenda</a>
			 <a tabindex="4" accesskey="J" href="../juegos.html">Juegos</a>
			 <a tabindex="5" accesskey="V" href="viajes.php">Viajes</a>
			 <a tabindex="6" accesskey="M" href="../metereologia.html">Metereología</a>
			 <a tabindex="7" accesskey="N" href="../noticias.html">Noticias</a>
			 <a tabindex="8" accesskey="R" href="restaurante.php">Restaurante</a>
			
		</nav>
		</header>
        <main>
            <section>
                <h2>Botones</h2>
                <button onclick="viaje.getMapaEstaticoMapbox()">Mostrar Mapa Estático</button>
                <button onclick="viaje.getMapaDinamicoMapbox()">Mostrar Mapa Dinámico</button>
            </section>
            <section>
                <h2>Opciones de carga</h2>
                <label for="xml">Procesar XML:</label>
                <input type="file"  id="xml" onchange="viaje.leerArchivoTexto(this)" accept=".xml" />
                <label for="kmls">Procesar kmls:</label>
                <input type="file"  id="kmls" onchange="viaje.getMapaDinamicoMapboxKml(this)" accept=".kml" multiple/>
                <label for="svgs">Procesar svgs:</label>
                <input type="file"  id="svgs" onchange="viaje.procesarSVGS(this)" accept=".svg" multiple/>
            </section>
            
            <article>
                <h3>
                Carrusel de Imágenes
                </h3>
                <?php
            
                $carrusel = new Carrusel('Kenia', 'Nairobi');

                
                $photos = $carrusel->llamadaApi();

                foreach ($photos as $photo) {
                    $photo_url = "https://farm{$photo['farm']}.staticflickr.com/{$photo['server']}/{$photo['id']}_{$photo['secret']}.jpg";
                    echo '<img src="' . $photo_url . '" alt="' . $photo['title'] . '">';
                }
                ?>
                <!-- Control buttons -->
                <button data-action="next"> > </button>
                <button data-action="prev"> < </button>
            </article>
            <article data-type=conversion>
                <h3>
                Conversión
                </h3>
                <?php

                $moneda = new Moneda('KES', 'EUR');

                
                $cantidad = $moneda->conversion();
                if ($cantidad !== false) {
                    $cantidadRedondeada = number_format($cantidad, 2);
                    echo "<p>La conversión es de {$cantidadRedondeada} KES por 1 EUR.</p>";
                } else {
                    echo "<p>Error al obtener la tasa de cambio.</p>";
                }
                
                ?>
            </article>
            </main>
	<script>
        const viaje = new Viajes();
        viaje.init();
    </script>
</body>
</html>
