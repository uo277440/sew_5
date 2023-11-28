// JavaScript source code
class Pais {
    constructor (nombrePais,nombreCapital,poblacion){
        this.nombrePais=nombrePais;
        this.nombreCapital=nombreCapital;
        this.poblacion=poblacion;
        this.apiKey='7b2782fafa43bd6bfa1daa35832516df'
    }
    rellenarAtributos(tipoGobierno,coordenadasCapital,religionMayoritaria){
        this.tipoGobierno=tipoGobierno;
        this.coordenadasCapital=coordenadasCapital;
        this.religionMayoritaria=religionMayoritaria;
    }
    getNombrePais(){
       return `<p>Nombre del país: ${this.nombrePais}</p>`;
    }
    getNombreCapital(){
        return `<p>Nombre de la capital: ${this.nombreCapital}</p>`;
    }
    getPoblacion(){
        return `<p>Población: ${this.poblacion}</p>`;
    }
    getTipoGobierno(){
        return `<p>Forma de gobierno: ${this.tipoGobierno}</p>`;
    }
    getReligionMayoritaria(){
        return `<p>Religión mayoritaria: ${this.religionMayoritaria}</p>`;
    }
    
    escribirCoordenadas(){
        document.write("<p> coordenadas capital: "+this.coordenadasCapital+"</p>");
    }
    secundariosHTML() {
        
        var htmlString = `
            <h2>${this.nombrePais}</h2>
            <ul>
                <li>Población:${this.poblacion}</li>
                <li>Forma de Gobierno:${this.tipoGobierno}</li>
                <li>Religión Mayoritaria:${this.religionMayoritaria}</li>
            </ul>
        `;
    
        
        return htmlString;
    }
    actualizarPronostico() {
        const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${this.nombreCapital}&appid=${this.apiKey}`;
        $.ajax({
            url: apiUrlForecast,
            method: "GET",
            dataType: "json"
        })
        .done(function (data) {
            const pronostico = data.list;
            const contenedor = $('body');
        
            const tabla = $("<table></table>");
        
            const filaEncabezado = $("<tr></tr>");
            filaEncabezado.append("<th>Fecha</th>");
            filaEncabezado.append("<th>Temperatura Máxima (°C)</th>");
            filaEncabezado.append("<th>Temperatura Mínima (°C)</th>");
            filaEncabezado.append("<th>Humedad (%)</th>");
            filaEncabezado.append("<th>Cantidad de Lluvia (mm)</th>");
            filaEncabezado.append("<th>Icono</th>");
            tabla.append(filaEncabezado);
            for (let i = 0; i < pronostico.length; i += 8) {
                const dia = pronostico[i];
        
               
                const fila = $("<tr></tr>");
                const tempMaxKelvin = dia.main.temp_max;
                const tempMinKelvin = dia.main.temp_min;
                const tempMaxGrados = tempMaxKelvin - 273.15;
                const tempMinGrados = tempMinKelvin - 273.15;
                fila.append(`<td>${dia.dt_txt}</td>`);
                fila.append(`<td>${tempMaxGrados.toFixed(1)}</td>`);
                fila.append(`<td>${tempMinGrados.toFixed(1)}</td>`);
                fila.append(`<td>${dia.main.humidity}</td>`);
                fila.append(`<td>${dia.rain ? dia.rain['3h'] : 0}</td>`);
        
                
                const iconoTiempo = $("<img>");
                iconoTiempo.attr("src", `https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`);
                const celdaIcono = $("<td></td>").append(iconoTiempo);
                fila.append(celdaIcono);
        
                tabla.append(fila);
            }
        
            
            contenedor.append(tabla);
        })
        .fail(function (error) {
            console.error("Error al obtener datos de OpenWeatherMap:", error);
        });
    }
}


