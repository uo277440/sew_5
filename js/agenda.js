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
            const tabla = $('<table>').addClass('table');
            const encabezado = `
              <thead>
                <tr>
                  <th>Nombre de la Carrera</th>
                  <th>Circuito</th>
                  <th>Coordenadas</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                </tr>
              </thead>
            `;
            tabla.append(encabezado);
    
            const cuerpoTabla = $('<tbody>');
           
            for (var i = 0; i < races.length; i++) {
                // Accede al elemento actual en la colección
                var carrera = races.eq(i);
                var nombreCircuito   = $(carrera).find('RaceName').text();
                var nombreCarrera   = $(carrera).find('CircuitName').text();
                var latitudCircuito   = $(carrera).find('Location').attr('lat');
                var longitudCircuito   = $(carrera).find('Location').attr('long');
                var fechaCarrera   = $(carrera).find('Race Date').html();
                var hora = $(carrera).find('Time').first().text().replace("Z", "");
                
                
                var fila = `
                <tr>
                    <td>${nombreCarrera}</td>
                    <td>${nombreCircuito}</td>
                    <td>${latitudCircuito} N ${longitudCircuito} E</td>
                    <td>${fechaCarrera}</td>
                    <td>${hora}</td>
                </tr>
                `;
            
                
                tabla.append(fila);
            }
    
            tabla.append(cuerpoTabla);
            contenedor.append(tabla);
          },
          error: (error) => {
            console.error('Error en la solicitud AJAX:', error);
          }
        });
      }
    }
