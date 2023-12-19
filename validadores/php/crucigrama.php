<?php
class Record {
    
    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $conn;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "records";
    }
    public function insertarRecord() {
        $this->conectarBaseDatos();

        $insercion = "INSERT INTO registro (NOMBRE, APELLIDOS, NIVEL, TIEMPO) values (?,?,?,?)";
        $pst = $this->db->prepare($insercion);
        $pst->bind_param(
            "ssss",
            $_REQUEST["nombre"],
            $_REQUEST["apellidos"],
            $_REQUEST["nivel"],
            $_REQUEST["tiempo"]
        );
            $resultado = $pst->execute();
            if ($resultado) {
                $this->msgAviso = "Se ha insertado el record";
            } else {
                $this->msgAviso = "ERROR: Error en la insercción";
            }
    }
    public function mejoresRegistros() {
        $this->conectarBaseDatos();
    
        $consulta = "SELECT * FROM registro ORDER BY tiempo LIMIT 10";
        $stmt = $this->db->prepare($consulta);
    
        $resultados = [];
    
        if ($stmt) {
            $stmt->execute();
            $resultados = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            $this->msgAviso = "Se ha consultado el record";
        } else {
            $this->msgAviso = "ERROR: Error en la consulta";
        }
    
        $this->resultados = $resultados;
        return $resultados;
    }
    public function conectarBaseDatos() {
        $this->db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($this->db->connect_errno) {
            $this->msgAviso = "ERROR: No se ha podido conectar a la base de datos.";
        } else {
            $this->msgAviso = "Se ha conectado a la base de datos con éxito.";
        }
    }

    public function desconectarBaseDatos() {
        $this->db->close();
    }

    public function ejecutarQuery($query) {
        $resultado = $this->db->query($query);
        if ($resultado) {
            return $resultado;
        }
    }

    public function getMsgAviso() {
        return $this->msgAviso;
    }
}

if (!isset($_SESSION["db"])) {
    $db = new Record();
    $db->conectarBaseDatos();
    $_SESSION["db"] = $db;
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
    <link rel="stylesheet" type="text/css" href="../estilo/juegos.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/crucigrama.css" />
    <link rel="icon" href="multimedia/favicon.ico"/>
	<script src="../js/crucigrama.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual</title>
	
</head>
<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
		<h1>Crucigrama</h1>
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
        <section>
			<h2>Juegos disponibles</h2>
				<nav>
					<menu>
                    <li><a href="../sudoku.html">Sudoku</a></li>
                    <li><a href="../memoria.html">Memoria</a></li>
                    <li><a href="../api.html">ApiGame</a></li>
					</menu>
				</nav>
			</section>
    <main>
        <section>
            <h2>Instrucciones</h2>
            <p>Se deben completar los huecos en blanco utilizando números del 1-9 y los operadores matemáticos básicos *(multiplicar) /(dividir) +(sumar) -(restar)</p>
        </section>
		<section data-type="botonera">
			<h2>Botonera</h2>
			<button onclick="crucigrama.introduceElement(1)">1</button>
			<button onclick="crucigrama.introduceElement(2)">2</button>
			<button onclick="crucigrama.introduceElement(3)">3</button>
			<button onclick="crucigrama.introduceElement(4)">4</button>
			<button onclick="crucigrama.introduceElement(5)">5</button>
			<button onclick="crucigrama.introduceElement(6)">6</button>
			<button onclick="crucigrama.introduceElement(7)">7</button>
			<button onclick="crucigrama.introduceElement(8)">8</button>
			<button onclick="crucigrama.introduceElement(9)">9</button>
			<button onclick="crucigrama.introduceElement('*')">*</button>
			<button onclick="crucigrama.introduceElement('+')">+</button>
			<button onclick="crucigrama.introduceElement('-')">-</button>
			<button onclick="crucigrama.introduceElement('/')">/</button>
		</section>
        <?php
        if (count($_POST) > 0) {
            $db = $_SESSION["db"];
        
            if (isset($_POST["insertarRecord"])) {
           
                $db->insertarRecord();
    
                
                $db->mejoresRegistros();
                
               
                echo "<section>";
                echo "<h2>Top 10 Mejores Récords</h2>";
                echo "<ol>";
    
                foreach ($db->resultados as $record) {
                    $segundos = $record['tiempo'];
                    $horas = floor($segundos / 3600);
                    $minutos = floor(($segundos % 3600) / 60);
                    $segundos = $segundos % 60;
                    $tiempo_formateado = sprintf('%02d:%02d:%02d', $horas, $minutos, $segundos);
                    echo "<li>";
                    echo "<strong>{$record['nombre']} {$record['apellidos']}</strong> - Tiempo: $tiempo_formateado";
                    echo "</li>";
                }
    
                echo "</ol>";
                echo "</section>";
            }
        
            $db->desconectarBaseDatos();
            $_SESSION["db"] = $db;
        }
        
        ?>
		
    </main>
	<script>
	var crucigrama = new Crucigrama()
    document.addEventListener('keydown', function(event) {
		var someClicked = $('p[data-state = "clicked"]')
		numero = parseInt(event.key)
		if(someClicked.length===0){
			console.log("CELDA NO SELECCIONADA")
		}else{
			
                crucigrama.introduceElement(event.key);
		
		}
		
        
    });
</script>
</body>



</html>