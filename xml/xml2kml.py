import xml.etree.ElementTree as ET

def generar_kml(nombre_archivo_xml, nombre_archivo_kml,indice_ruta):
    # Parsear el archivo XML
    tree = ET.parse(nombre_archivo_xml)
    root = tree.getroot()
    print(ET.tostring(root))
    namespace = {'ns0': 'http://tempuri.org/rutas'}
    # Parte a: Escritura del prólogo
    kml = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
    document = ET.SubElement(kml, 'Document')
    rutas = root.findall(".//ns0:ruta",namespace)
    ruta = rutas[indice_ruta]
    # Parte b: Escritura de las coordenadas
    
    nombre_ruta = ruta.get("nombre")
    coordenadas = ruta.find(".//ns0:coordenadasInicio",namespace)
    if coordenadas is not None:
        longitud = coordenadas.find(".//ns0:longitud", namespace).text
        latitud = coordenadas.find(".//ns0:latitud", namespace).text

        # Crear el elemento Placemark
        placemark = ET.SubElement(document, 'Placemark')
        ET.SubElement(placemark, 'name').text = nombre_ruta
        point = ET.SubElement(placemark, 'Point')
        ET.SubElement(point, 'coordinates').text = f"{longitud},{latitud}"
        # Añadir marcadores para los hitos
        for hito in ruta.findall(".//ns0:hito",namespace):
            nombre_hito = hito.get("nombre")
            coordenadas_hito = hito.find(".//ns0:coordenadas",namespace)
            if coordenadas_hito is not None:
                longitud_hito = coordenadas_hito.find(".//ns0:longitud", namespace).text
                latitud_hito = coordenadas_hito.find(".//ns0:latitud", namespace).text
                # Crear el elemento Placemark para el hito
                placemark_hito = ET.SubElement(document, 'Placemark')
                ET.SubElement(placemark_hito, 'name').text = nombre_hito
                point_hito = ET.SubElement(placemark_hito, 'Point')
                ET.SubElement(point_hito, 'coordinates').text = f"{longitud_hito},{latitud_hito}"

    # Parte c: Guardar el archivo KML
    with open(f'xml/{nombre_archivo_kml}', 'wb') as kml_file:
        kml_tree = ET.ElementTree(kml)
        kml_tree.write(kml_file)
        

if __name__ == "__main__":
    # Llamar a la función para cada ruta    
    generar_kml("xml/rutasEsquema.xml", "ruta1.kml",0)
    generar_kml("xml/rutasEsquema.xml", "ruta2.kml",1)
    generar_kml("xml/rutasEsquema.xml", "ruta3.kml",2)
