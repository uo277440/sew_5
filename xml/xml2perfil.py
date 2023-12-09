import xml.etree.ElementTree as ET

def generar_svg(ruta, num_ruta):
    # Obtener información de altimetría y distancias desde el archivo XML con el namespace
    altitudes = []
    distancias = []
    nombres_hitos = []
    ns = {'ns0': 'http://tempuri.org/rutas'}
    y_0=250
    y_inicial = float(ruta.find('./ns0:coordenadasInicio/ns0:altitud', namespaces=ns).text)
    nombre_ruta = ruta.attrib.get('nombre', '')
    acumulado=20
    for hito in ruta.findall('.//ns0:hito', namespaces=ns):
        distancia = float(hito.find('./ns0:distanciaAnterior', namespaces=ns).text)
        altitud = float(hito.find('./ns0:coordenadas/ns0:altitud', namespaces=ns).text)
        nombre_hito = hito.attrib.get('nombre', '')
        distancias.append(distancia)
        altitudes.append(altitud)
        nombres_hitos.append(nombre_hito)

    x=0
    y=0
    factor_escala=0.1
    puntos = ""
    etiquetas = ""
    puntos += f"{20},{y_0} " 
    puntos += f"{20},{y_inicial * factor_escala} " 
    etiquetas += f'<text x="{20}" y="{y_0+15}" style="writing-mode: tb; glyph-orientation-vertical: 0;">Inicio</text>\n'
    for distancia, altitud,nombre_hito in zip(distancias, altitudes,nombres_hitos):
        x = acumulado + distancia
        y = altitud
        acumulado += distancia
        puntos += f"{x},{y * factor_escala} "
        etiquetas += f'<text x="{x}" y="{y_0+15}" style="writing-mode: tb; glyph-orientation-vertical: 0;">{nombre_hito}</text>\n'
    puntos += f"{x},{y_0} "    
    x = 20
    puntos += f"{x},{y_0} "

    svg_contenido = f"""<?xml version="1.0" encoding="UTF-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
        <title>{nombre_ruta}</title>
        <rect width="100%" height="100%" fill="#F0F0F0" />
        <polyline points="{puntos}" fill="none" stroke="red" stroke-width="2" />
        {etiquetas}
    </svg>"""

    with open(f'perfil{num_ruta}.svg', 'w') as svg_file:
        svg_file.write(svg_contenido)

def main():
    tree = ET.parse('xml/rutasEsquema.xml')
    root = tree.getroot()

    for i, ruta in enumerate(root.findall('.//ns0:ruta', namespaces={'ns0': 'http://tempuri.org/rutas'})):
        generar_svg(ruta, i + 1)

if __name__ == "__main__":
    main()

    