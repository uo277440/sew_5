<?php
class Restaurante {
    
    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $conn;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "restaurante";
        $this->crearBaseDeDatos();
        
    }
    public function exportarDatosCSV() {
        $this->db->select_db($this->dbname);
        $tablas = array('clientes', 'empleados', 'menus', 'reservas', 'mesas');

        $contenidoTotalCSV = '';

        foreach ($tablas as $tabla) {
            $contenidoCSV = $this->obtenerContenidoCSV($tabla);
            $contenidoTotalCSV .= $contenidoCSV;
        }

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="fichero.csv"');
        header('Pragma: no-cache');
        header('Expires: 0');

        echo $contenidoTotalCSV;
        exit();
    }

    private function obtenerContenidoCSV($tabla) {
        $query = "SELECT * FROM $tabla";
        $result = $this->db->query($query);

        $csv = '';
        $heads = array();
        while ($columna = $result->fetch_field()) {
            $heads[] = $columna->name;
        }
        $csv .= implode(',', $heads) . "\n";
        while ($fila = $result->fetch_assoc()) {
            $csv .= implode(',', $fila) . "\n";
        }
        return $csv;
    }
    
    
    public function conectarBaseDatosCreacion() {
        $this->db = new mysqli($this->server, $this->user, $this->pass);
        if ($this->db->connect_errno) {
            $this->msgAviso = "ERROR: No se ha podido conectar a la base de datos.";
        } else {
            $this->msgAviso = "Se ha conectado a la base de datos con éxito.";
        }
    }
    public function conectarBaseDatos() {
        $this->db = new mysqli($this->server, $this->user, $this->pass,$this->dbname);
        if ($this->db->connect_errno) {
            $this->msgAviso = "ERROR: No se ha podido conectar a la base de datos.";
        } else {
            $this->msgAviso = "Se ha conectado a la base de datos con éxito.";
        }
    }
    public function desconectarBaseDatos() {
        $this->db->close();
    }
    public function crearBaseDeDatos() {
        $this->conectarBaseDatosCreacion();
        $this->query("CREATE DATABASE IF NOT EXISTS restaurante;");
        $this->db->select_db("restaurante");

        $this->crearTablaClientes();
        $this->crearTablaMesas();
        $this->crearTablaReservas();
        $this->crearTablaMenus();
        $this->crearTablaEmpleados();
    }
    public function query($query) {
        $resultado = $this->db->query($query);
        if ($resultado) {
            return $resultado;
        }
    }
    public function intentarReserva($capacidad, $fecha, $hora)
    {
    $this->conectarBaseDatos();
    $this->db->select_db("restaurante");

    $consultaDisponibilidad = "SELECT m.id_mesa
    FROM mesas m
    WHERE m.capacidad >= ? 
    AND NOT EXISTS (
        SELECT 1
        FROM reservas r
        WHERE m.id_mesa = r.id_mesa
        AND r.fecha = ?
        AND (
        TIMEDIFF(?, '18:05') BETWEEN '00:00:00' AND '01:00:00'
        OR TIMEDIFF('18:05', ?) BETWEEN '00:00:00' AND '01:00:00'
    )
    )
    LIMIT 1";

    $stmt = $this->db->prepare($consultaDisponibilidad);
    $stmt->bind_param("isss", $capacidad, $fecha, $hora,$hora);
    $stmt->execute();
    $stmt->bind_result($id_mesa);
    $stmt->fetch();
    $stmt->close();

    if (!empty($id_mesa)) {
        return $id_mesa; 
    } else {
        return false; 
    }
}
public function insertarReserva($nombre, $telefono, $fecha, $hora, $id_mesa,$correo)
{
    $id_cliente = $this->obtenerIdCliente($nombre, $telefono,$correo);

    $insercionReserva = "INSERT INTO reservas (id_cliente, fecha, hora, id_mesa)
                         VALUES (?, ?, ?, ?)";

    $stmt = $this->db->prepare($insercionReserva);
    $stmt->bind_param("issi", $id_cliente, $fecha, $hora, $id_mesa);
    $resultado = $stmt->execute();
    $stmt->close();

    return $resultado;
}
public function empleo($nombre, $puesto,$salario)
{
    

    $insercionReserva = "INSERT INTO empleados (nombre, cargo, salario)
                         VALUES (?, ?, ?)";

    $stmt = $this->db->prepare($insercionReserva);
    $stmt->bind_param("ssi", $nombre, $puesto, $salario);
    $resultado = $stmt->execute();
    $stmt->close();

    return $resultado;
}
public function carta()
{
    $cartaQuery = "SELECT id_menu, nombre, descripcion, precio FROM menus";

    $stmt = $this->db->prepare($cartaQuery);

    if ($stmt) {
        $stmt->execute();
        $resultados = $stmt->get_result();

        if ($resultados) {
            $resultadosArray = $resultados->fetch_all();
            $stmt->close();
            return $resultadosArray;
        }
            $stmt->close();
            return false;
        
    } 
        return false;
    
}

private function obtenerIdCliente($nombre, $telefono,$correo)
{
    
    $consultaCliente = "SELECT id_cliente FROM clientes WHERE nombre = ? AND telefono = ? AND email = ?";
    $stmtCliente = $this->db->prepare($consultaCliente);
    $stmtCliente->bind_param("sss", $nombre, $telefono,$correo);
    $stmtCliente->execute();
    $stmtCliente->bind_result($id_cliente);

    if ($stmtCliente->fetch()) {
        $stmtCliente->close();
        return $id_cliente;
    } else {
        $stmtCliente->close();
        $insercionCliente = "INSERT INTO clientes (nombre, telefono,email) VALUES (?, ?,?)";
        $stmtInsertarCliente = $this->db->prepare($insercionCliente);
        $stmtInsertarCliente->bind_param("sss", $nombre, $telefono,$correo);
        $stmtInsertarCliente->execute();
        $id_cliente = $stmtInsertarCliente->insert_id;
        $stmtInsertarCliente->close();

        return $id_cliente;
    }
}
    private function crearTablaClientes() {
        $sql = "CREATE TABLE IF NOT EXISTS clientes (
            id_cliente INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            telefono VARCHAR(20),
            email VARCHAR(255)
        )";
        $this->query($sql);
    }

    private function crearTablaMesas() {
        $sql = "CREATE TABLE IF NOT EXISTS mesas (
            id_mesa INT AUTO_INCREMENT PRIMARY KEY,
            capacidad INT NOT NULL,
            ubicacion VARCHAR(255)
        )";
        $this->query($sql);
    }

    private function crearTablaReservas() {
        $sql = "CREATE TABLE IF NOT EXISTS reservas (
            id_reserva INT AUTO_INCREMENT PRIMARY KEY,
            id_cliente INT,
            id_mesa INT,
            fecha DATE,
            hora TIME,
            FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
            FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa)
        )";
        $this->query($sql);
    }

    private function crearTablaMenus() {
        $sql = "CREATE TABLE IF NOT EXISTS menus (
            id_menu INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            descripcion TEXT,
            precio DECIMAL(10, 2) NOT NULL
        )";
        $this->query($sql);
    }

    private function crearTablaEmpleados() {
        $sql = "CREATE TABLE IF NOT EXISTS empleados (
            id_empleado INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            cargo VARCHAR(255),
            salario DECIMAL(10, 2) NOT NULL
        )";
        $this->query($sql);
    }

    public function cargarClientesDesdeCSV() {
        $this->conectarBaseDatos();
        $this->db->select_db("restaurante");
    
        $nombre = null;
        if (isset($_FILES["csv"])) {
            $nombre = $_FILES["csv"]["tmp_name"];
        }
    
        $fichero = fopen($nombre, "r");
        while (($datos = fgetcsv($fichero)) !== false) {
            $clienteExistente = $this->buscarClientePorId($datos[0]);
    
            if ($clienteExistente) {
                $this->msgAviso = "Cliente con ID {$datos[0]} ya existe en la base de datos. No se ha insertado.";
                continue;
            } 
                $insercion = "INSERT INTO clientes (id_cliente, nombre, telefono, email) VALUES (?, ?, ?, ?)";
                $pst = $this->db->prepare($insercion);
                $pst->bind_param("isss", $datos[0], $datos[1], $datos[2], $datos[3]);
                $resultado = $pst->execute();
    
                if ($resultado) {
                    $this->msgAviso = "Se han cargado los clientes con éxito";
                } else {
                    $this->msgAviso = "ERROR: No se ha podido cargar el fichero CSV de clientes.";
                }
            
        }
        fclose($fichero);
    }
    

    private function buscarClientePorId($idCliente) {
        $consulta = "SELECT id_cliente FROM clientes WHERE id_cliente = ?";
        $pst = $this->db->prepare($consulta);
        $pst->bind_param("i", $idCliente);
        $pst->execute();
        $resultado = $pst->get_result();
    
        return $resultado->num_rows > 0;
    }
   

    public function cargarMesasDesdeCSV() {
        $this->conectarBaseDatos();
        $this->db->select_db("restaurante");
    
        $nombre = null;
        if (isset($_FILES["csv"])) {
            $nombre = $_FILES["csv"]["tmp_name"];
        }
    
        $fichero = fopen($nombre, "r");
        while (($datos = fgetcsv($fichero)) !== false) {
            $mesaExistente = $this->buscarMesaPorId($datos[0]);
    
            if ($mesaExistente) {
                $this->msgAviso = "Mesa con ID {$datos[0]} ya existe en la base de datos. No se ha insertado.";
                continue;
            }
    
            $insercion = "INSERT INTO mesas (id_mesa, capacidad, ubicacion) VALUES (?, ?, ?)";
            $pst = $this->db->prepare($insercion);
            $pst->bind_param("iss", $datos[0], $datos[1], $datos[2]);
            $resultado = $pst->execute();
    
            if ($resultado) {
                $this->msgAviso = "Se han cargado las mesas con éxito";
            } else {
                $this->msgAviso = "ERROR: No se ha podido cargar el fichero CSV de mesas.";
            }
        }
        fclose($fichero);
    }
    
    private function buscarMesaPorId($idMesa) {
        $consulta = "SELECT id_mesa FROM mesas WHERE id_mesa = ?";
        $pst = $this->db->prepare($consulta);
        $pst->bind_param("i", $idMesa);
        $pst->execute();
        $resultado = $pst->get_result();
    
        return $resultado->num_rows > 0;
    }

    public function cargarReservasDesdeCSV() {
        $this->conectarBaseDatos();
        $this->db->select_db("restaurante");
    
        $nombre = null;
        if (isset($_FILES["csv"])) {
            $nombre = $_FILES["csv"]["tmp_name"];
        }
    
        $fichero = fopen($nombre, "r");
        while (($datos = fgetcsv($fichero)) !== false) {
            $reservaExistente = $this->buscarReservaPorId($datos[0]);
    
            if ($reservaExistente) {
                $this->msgAviso = "Reserva con ID {$datos[0]} ya existe en la base de datos. No se ha insertado la reserva.";
                continue; 
            }
    
          
            $clienteExistente = $this->buscarClientePorId($datos[1]);
            $mesaExistente = $this->buscarMesaPorId($datos[2]);
    
            if (!$clienteExistente) {
                $this->msgAviso = "Cliente con ID {$datos[1]} no existe en la base de datos. No se ha insertado la reserva.";
                continue; 
            }
    
            if (!$mesaExistente) {
                $this->msgAviso = "Mesa con ID {$datos[2]} no existe en la base de datos. No se ha insertado la reserva.";
                continue; 
            }
    
            $insercion = "INSERT INTO reservas (id_reserva, id_cliente, id_mesa, fecha, hora) VALUES (?, ?, ?, ?, ?)";
            $pst = $this->db->prepare($insercion);
            $pst->bind_param("iiiss", $datos[0], $datos[1], $datos[2], $datos[3], $datos[4]);
            $resultado = $pst->execute();
    
            if ($resultado) {
                $this->msgAviso = "Se han cargado las reservas con éxito";
            } else {
                $this->msgAviso = "ERROR: No se ha podido cargar el fichero CSV de reservas.";
            }
        }
        fclose($fichero);
    }
    
    private function buscarReservaPorId($idReserva) {
        $consulta = "SELECT id_reserva FROM reservas WHERE id_reserva = ?";
        $pst = $this->db->prepare($consulta);
        $pst->bind_param("i", $idReserva);
        $pst->execute();
        $resultado = $pst->get_result();
    
        return $resultado->num_rows > 0;
    }

    public function cargarMenusDesdeCSV() {
        $this->conectarBaseDatos();
        $this->db->select_db("restaurante");
    
        $nombre = null;
        if (isset($_FILES["csv"])) {
            $nombre = $_FILES["csv"]["tmp_name"];
        }
    
        $fichero = fopen($nombre, "r");
        while (($datos = fgetcsv($fichero)) !== false) {
            $menuExistente = $this->buscarMenuPorId($datos[0]);
    
            if ($menuExistente) {
                $this->msgAviso = "Menú con ID {$datos[0]} ya existe en la base de datos. No se ha insertado.";
                continue; 
            }
    

            $insercion = "INSERT INTO menus (id_menu, nombre, descripcion, precio) VALUES (?, ?, ?, ?)";
            $pst = $this->db->prepare($insercion);
            $pst->bind_param("issd", $datos[0], $datos[1], $datos[2], $datos[3]);
            $resultado = $pst->execute();
    
            if ($resultado) {
                $this->msgAviso = "Se han cargado los menús con éxito";
            } else {
                $this->msgAviso = "ERROR: No se ha podido cargar el fichero CSV de menús.";
            }
        }
        fclose($fichero);
    }
    
    private function buscarMenuPorId($idMenu) {
        $consulta = "SELECT id_menu FROM menus WHERE id_menu = ?";
        $pst = $this->db->prepare($consulta);
        $pst->bind_param("i", $idMenu);
        $pst->execute();
        $resultado = $pst->get_result();
    
        return $resultado->num_rows > 0;
    }
    
    public function cargarEmpleadosDesdeCSV() {
        $this->conectarBaseDatos();
        $this->db->select_db("restaurante");
    
        $nombre = null;
        if (isset($_FILES["csv"])) {
            $nombre = $_FILES["csv"]["tmp_name"];
        }
    
        $fichero = fopen($nombre, "r");
        while (($datos = fgetcsv($fichero)) !== false) {
            $empleadoExistente = $this->buscarEmpleadoPorId($datos[0]);
    
            if ($empleadoExistente) {
                $this->msgAviso = "Empleado con ID {$datos[0]} ya existe en la base de datos. No se ha insertado.";
                continue; 
            }
    
            $insercion = "INSERT INTO empleados (id_empleado, nombre, cargo, salario) VALUES (?, ?, ?, ?)";
            $pst = $this->db->prepare($insercion);
            $pst->bind_param("issd", $datos[0], $datos[1], $datos[2], $datos[3]);
            $resultado = $pst->execute();
    
            if ($resultado) {
                $this->msgAviso = "Se han cargado los empleados con éxito";
            } else {
                $this->msgAviso = "ERROR: No se ha podido cargar el fichero CSV de empleados.";
            }
        }
        fclose($fichero);
    }
    
    private function buscarEmpleadoPorId($idEmpleado) {
        $consulta = "SELECT id_empleado FROM empleados WHERE id_empleado = ?";
        $pst = $this->db->prepare($consulta);
        $pst->bind_param("i", $idEmpleado);
        $pst->execute();
        $resultado = $pst->get_result();
    
        return $resultado->num_rows > 0;
    }
    
}
if (!isset($_SESSION["db"])) {
    $db = new Restaurante();
    $db->conectarBaseDatos();
    $_SESSION["db"] = $db;
    
    
}
if (count($_POST) > 0) {
    if (isset($_POST["exportarDatosCSV"])) $db->exportarDatosCSV();
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
	<link rel="stylesheet" type="text/css" href="../estilo/restaurante.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/juegos.css" />
    <link rel="icon" href="../multimedia/favicon.ico"/>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js'></script>
	<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
	<script src="../js/viajes.js"></script>
    <title>Escritorio Virtual</title>
	
</head>

<body>
    <header>
		<h1>Restaurante</h1>
		<nav>
			
			 <a tabindex="1" accesskey="I" href="../index.html">Inicio</a>
			 <a tabindex="2" accesskey="S" href="../sobremi.html">Sobre mi</a>
			 <a tabindex="3" accesskey="A" href="../agenda.html">Agenda</a>
			 <a tabindex="4" accesskey="J" href="../juegos.html">Juegos</a>
			 <a tabindex="5" accesskey="V" href="viajes.php">Viajes</a>
			 <a tabindex="6" accesskey="M" href="../metereologia.html">Metereología</a>
			 <a tabindex="7" accesskey="N" href="../noticias.html">Noticias</a>
			
		</nav>
		</header>
        <section>
			<h2>Juegos disponibles</h2>
				<nav>
					<menu>
                    <li><a href="../sudoku.html">Sudoku</a></li>
                    <li><a href="../memoria.html">Memoria</a></li>
                    <li><a href="./crucigrama.php">Crucigrama</a></li>
                    <li><a href="../api.html">ApiGame</a></li>
					</menu>
				</nav>
			</section>
    <main>
    <form action="#" method="post">
        <input type="submit" value="Mostrar Carta" name="mostrarCarta"/>
    </form>
    
    <section>
        <h2>Conozca Nuestros Menús</h2>
            <?php
            if (count($_POST) > 0) {
                $dbRestaurante = $_SESSION["db"];
                if (isset($_POST["mostrarCarta"])) {
                    $carta = $dbRestaurante->carta();

                    if ($carta !== false) {
                        foreach ($carta as $menu) {
                            echo "<h3>{$menu[1]}</h3>";
                            echo "<p>Descripción: {$menu[2]}</p>";
                            echo "<p>Precio: {$menu[3]}</p>";
                        }


                    } else {
                        echo "<p>No tenemos menús actualmente.</p>";
                    }
                }

                $_SESSION["dbRestaurante"] = $dbRestaurante;
        }
    ?>
            

  </section>
        <h2>Reserva en el Restaurante</h2>
        <h3>Elige los datos que mejor se ajusten a sus necesidades</h3>
    <form action="#" method="post">
        <label for="nombre">Nombre:</label>
        <input type="text" id=nombre name="nombre" required>
        <label for="tlf">Teléfono:</label>
        <input type="tel" id=tlf name="telefono" required>
        <label for="correo">Correo:</label>
        <input type="text" id="correo" name="correo" required>
        <fieldset>
            <legend>Escoge mesa:</legend>
            <label for="1p">1 persona:</label>
            <input type="radio" id=1p name="capacidad" value="1" required/> 
            <label for="2p">2 personas:</label>
            <input type="radio" id=2p name="capacidad" value="2" required/> 
            <label for="4p">4 personas:</label>
            <input type="radio" id=4p name="capacidad" value="4" required/> 
            <label for="6p">6 personas:</label>
            <input type="radio" id=6p name="capacidad" value="6" required/> 
        </fieldset>
            <label for="fecha">Fecha:</label>
            <input type="date" id="fecha" name="fecha" min="<?php echo date('Y-m-d', strtotime('+1 day')); ?>" required/>
            <label for="hora">Hora:</label>
            <input type="time" id="hora" name="hora" required/>
        <input type="submit" value="Reservar" name="reservar"/>
    </form>
    <?php

if (count($_POST) > 0) {
    $dbRestaurante = $_SESSION["db"];
    if (isset($_POST["cargarReservasDesdeCSV"])) $db->cargarReservasDesdeCSV();
    if (isset($_POST["cargarClientesDesdeCSV"])) $db->cargarClientesDesdeCSV();
    if (isset($_POST["cargarMesasDesdeCSV"])) $db->cargarMesasDesdeCSV();
    if (isset($_POST["cargarEmpleadosDesdeCSV"])) $db->cargarEmpleadosDesdeCSV();
    if (isset($_POST["empleo"])){
        $nombre = $_POST["nombre"];
        $telefono = $_POST["telefono"];
        $correo = $_POST["correo"];
        $cargo = $_POST["puesto"];
        $db->empleo($nombre,$cargo,12000);
    }
    if (isset($_POST["cargarMenusDesdeCSV"])) $db->cargarMenusDesdeCSV();
    if (isset($_POST["reservar"])) {
        $nombre = $_POST["nombre"];
        $telefono = $_POST["telefono"];
        $capacidad = $_POST["capacidad"];
        $fecha = $_POST["fecha"];
        $hora = $_POST["hora"];
        $correo = $_POST["correo"];
        $id_mesa = $dbRestaurante->intentarReserva($capacidad, $fecha, $hora);

        if ($id_mesa !== false) {
            $dbRestaurante->insertarReserva($nombre, $telefono, $fecha, $hora,$id_mesa,$correo );


            
            echo "<section>";
            echo "<h2>Resumen de la Reserva</h2>";
            echo "<p>¡Gracias por reservar en nuestro restaurante, $nombre!</p>";
            echo "<p>Nombre: $nombre</p>";
            echo "<p>Teléfono: $telefono</p>";
            echo "<p>Correo: $correo</p>";
            echo "<p>Mesa para $capacidad personas</p>";
            echo "<p>Fecha: $fecha</p>";
            echo "<p>Hora: $hora</p>";
            echo "</section>";

        } else {
            echo "<section>";
            echo "<p>Lo sentimos, no hay mesas disponibles para la reserva seleccionada.</p>";
            echo "</section>";
        }
    }

    
    $_SESSION["dbRestaurante"] = $dbRestaurante;
}
?>
    </section>
        <h2>Estamos buscando gente !!</h2>
        <h3>Completa el formulario si está interesado</h3>
    <form action="#" method="post">
        <label for="nombre2">Nombre:</label>
        <input type="text" id=nombre2 name="nombre" required>
        <label for="tlf2">Teléfono:</label>
        <input type="tel" id=tlf2 name="telefono" required>
        <label for="correo2">Correo:</label>
        <input type="text" id="correo2" name="correo" required>
        <fieldset>
            <legend>Puesto para el que postula:</legend>
            <label for="camarero">Camarero:</label>
            <input type="radio" id=camarero name="puesto" value="Camarero" required/> 
            <label for="cocinero">Cocinero:</label>
            <input type="radio" id=cocinero name="puesto" value="Cocinero" required/> 
            <label for="media">Social Media:</label>
            <input type="radio" id=media name="puesto" value="Social Media" required/> 
        </fieldset>
        <input type="submit" value="Enviar" name="empleo"/>
    </form>
    
</main>
    <section>
        <h4>Cargar Reservas</h4>
        <form action="#" method="POST" enctype="multipart/form-data">
            <label for=reservas>Cargar reservas: </label>
            <input id=reservas name="csv" type="file" accept=".csv"/>
            <input type="submit"  value="Presione para cargar el archivo" name="cargarReservasDesdeCSV" />
        </form>
    </section>
    <section>
        <h4>Cargar Clientes</h4>
        <form action="#" method="POST" enctype="multipart/form-data">
            <label for=cls>Cargar mesas: </label>
            <input id=cls name="csv" type="file" accept=".csv"/>
            <input type="submit"  value="Presione para cargar el archivo" name="cargarClientesDesdeCSV" />
        </form>
    </section>
    <section>
        <h4>Cargar Menús</h4>
        <form action="#" method="POST" enctype="multipart/form-data">
            <label for=menus>Cargar menús: </label>
            <input id=menus name="csv" type="file" accept=".csv"/>
            <input type="submit"  value="Presione para cargar el archivo" name="cargarMenusDesdeCSV" />
        </form>
    </section>
    <section>
        <h4>Cargar Mesas</h4>
        <form action="#" method="POST" enctype="multipart/form-data">
            <label for=mesas>Cargar mesas: </label>
            <input id=mesas name="csv" type="file" accept=".csv"/>
            <input type="submit"  value="Presione para cargar el archivo" name="cargarMesasDesdeCSV" />
        </form>
    </section>
    <section>
        <h4>Cargar Empleados</h4>
        <form action="#" method="POST" enctype="multipart/form-data">
            <label for=empls>Cargar empleados: </label>
            <input id=empls name="csv" type="file" accept=".csv"/>
            <input type="submit"  value="Presione para cargar el archivo" name="cargarEmpleadosDesdeCSV" />
        </form>
    </section>
    <form action="#" method="post">
        <input type="submit" value="Exportar datos a CSV" name="exportarDatosCSV"/>
    </form>

</body>
</html>