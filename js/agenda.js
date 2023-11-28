class Agenda{
    contructor(url){
        this.url=url
        last_api_call=null
        last_api_result=null
        //http://ergast.com/api/f1/current url
    }
    carreras() {
        const apiErgast = 'http://ergast.com/api/f1/current';
        $.ajax({
            url: apiErgast,
            method: "GET",
            dataType: "json"
        })
        .done(function (data) {
            const pronostico = data.list;
            const contenedor = $('body');
        
           
            for (let i = 0; i < pronostico.length; i += 8) {
                const carrera = pronostico[i];
    
            }
        
            
            contenedor.append(tabla);
        })
        .fail(function (error) {
            console.error("Error al obtener datos de OpenWeatherMap:", error);
        });
    }
}