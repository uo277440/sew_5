CREATE TABLE `reservas` (
  `id_reserva` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) DEFAULT NULL,
  `id_mesa` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_mesa` (`id_mesa`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_mesa`) REFERENCES `mesas` (`id_mesa`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci