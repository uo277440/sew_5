class Agenda{
    contructor(url){
        this.url=url
        last_api_call=null
        last_api_result=null
        
    }
    carreras() {
        
        const apiUrl = 'http://ergast.com/api/f1/current';
       
        $.ajax({
          url: apiUrl,
          dataType: "xml",
          method: 'GET',
          success: function(data) {
            this.last_api_call=new Date()
            this.last_api_result=data
            $('button').remove()
            const contenedor = $('section');

    
            var races = $('Race',data)
            const tabla = $('<table></table>');
            var contenido = `
              <caption>Datos del circuito actual</caption>
                <tr>
                  <th scope='col' id='nombre'>Nombre de la Carrera</th>
                  <th scope='col' id='circuito'>Circuito</th>
                  <th scope='col' id='coordenadas'>Coordenadas</th>
                  <th scope='col' id='fecha'>Fecha</th>
                  <th scope='col' id='hora'>Hora</th>
                </tr>
            `;
            
            
            
           
            for (var i = 0; i < races.length; i++) {
                // Accede al elemento actual en la colección
                var carrera = races.eq(i);
                var nombreCircuito   = $(carrera).find('RaceName').text();
                var nombreCarrera   = $(carrera).find('CircuitName').text();
                var latitudCircuito   = $(carrera).find('Location').attr('lat');
                var longitudCircuito   = $(carrera).find('Location').attr('long');
                var fechaCarrera   = $(carrera).find('Race Date').html();
                var hora = $(carrera).find('Time').first().text().replace("Z", "");
                
                
                contenido += `
                <tr>
                    <td headers='nombre'>${nombreCarrera}</td>
                    <td headers='circuito'>${nombreCircuito}</td>
                    <td headers='coordenadas'>${latitudCircuito} N ${longitudCircuito} E</td>
                    <td headers='fecha'>${fechaCarrera}</td>
                    <td headers='hora'>${hora}</td>
                </tr>
                `;
            
                
                
            }
            tabla.append(contenido);
            contenedor.append(tabla);
          },
          error: (error) => {
            console.error('Error en la solicitud AJAX:', error);
          }
        });
      }
    }
