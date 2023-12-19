class Noticias{
    constructor(){
        if (window.File && window.FileReader && window.FileList && window.Blob) 
        {  
            //El navegador soporta el API File
            document.write("<p>Este navegador soporta el API File </p>");
        }
            else document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
    }
    readInputFile(fileInput) {
        const contenedor = document.querySelector('main')
        
        const file = fileInput.files[0];
        //var secciones =['Titular', 'Entradilla', 'Texto',
            //'Autor']
        if (file) {
          const reader = new FileReader()

          reader.onload = (e) => {
            const contenido = e.target.result;
            const lineas = contenido.split('\n')

            // Crear la estructura HTML
            lineas.forEach((linea, index) => {
              var elementos = linea.split("_")
              const h2 = document.createElement('h2')
              h2.textContent = elementos[0]
              var section = document.createElement('section')
              section.appendChild(h2);
              for(var i=1;i<elementos.length;i++){
                const p = document.createElement('p')
                p.textContent = elementos[i]
                section.appendChild(p);
              }
              contenedor.append(section)
            });
          };

          reader.readAsText(file);
        } else {
          console.error('Archivo no seleccionado.')
        }
        
      }
      addNoticia() {
        const camposTexto = document.querySelectorAll('input[type="text"]');
        const valores = Array.from(camposTexto).map(input => input.value);
        var main= document.querySelector('main')
        if (valores.every(Boolean)) {
          var section = document.createElement('section')
          var h2 = document.createElement('h2')
          h2.textContent=valores[0]
          section.appendChild(h2)
          for(var i=1;i<valores.length;i++){
            var p=document.createElement('p')
            p.textContent=valores[i]
            section.appendChild(p)
          }
          main.append(section)
          camposTexto.forEach(input => input.value = '')
        } else {
          alert('Por favor, completa todos los campos para agregar la noticia.');
        }
        
      }

     
    }
    
