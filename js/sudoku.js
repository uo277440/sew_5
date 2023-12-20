class Sudoku{
    constructor(){
        this.cadena="3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6"
        this.filas=9
        this.columnas=9
        this.tablero=new Array(this.filas)
        for (var i = 0; i < this.tablero.length; i++) {
            this.tablero[i] = new Array(this.columnas);
          }
        this.start()


    }
    start(){
        var pos = 0
        for (var i = 0; i < this.filas; i++) {
            for (var j = 0; j < this.columnas; j++) {
              if(this.cadena[pos]==="."){
                this.tablero[i][j]='0';
              }else{
                this.tablero[i][j]=this.cadena[pos];
              }
              pos++
            }
          }
    }
    createStructure() {
        var main=document.createElement('main');
        var contenedor = document.querySelector('body'); 
        for (var i = 0; i < this.filas; i++) {
          for (var j = 0; j < this.columnas; j++) {
            var p = document.createElement('p');
            main.appendChild(p);
          }
        }
        contenedor.append(main)
      }
    paintSudoku(){
        this.createStructure()
        const parrafos = document.querySelectorAll('p');
        var pn = 0
        for (var i = 0; i < this.filas; i++) {
            for (var j = 0; j < this.columnas; j++) {
                if(this.tablero[i][j]!='0'){
                    parrafos[pn].textContent = this.tablero[i][j];
                    parrafos[pn].setAttribute("data-state","blocked")
                    
                }else{
                    parrafos[pn].textContent = "";
                    parrafos[pn].setAttribute("data-state","default")
                    parrafos[pn].addEventListener('click',this.click.bind(parrafos[pn]));
                    
                }
                
                pn++
            }
          }
    }
    click(){
      var someClicked = document.querySelectorAll('p[data-state = "clicked"]')
      if(someClicked.length === 0){
        this.setAttribute("data-state","clicked")
      }else{
        someClicked[0].setAttribute("data-state","default")
        this.setAttribute("data-state","clicked")
      }
      
    }
    introduceNumber(numero){
     
      var someClicked = document.querySelectorAll('p[data-state = "clicked"]')
      
        if(this.valido(numero,someClicked[0])){
          someClicked[0].textContent=numero
          someClicked[0].setAttribute("data-state","correct")
        }
        
      }
      valido(numero,someCLicked){
        if(this.comprobarFila(numero,someCLicked) && this.comprobarColumna(numero,someCLicked) ){
          if(this.comprobarConjunto(numero,someCLicked)){
            return true
          }else{
            return false
          }
          
          
        }else{
          return false
        }

      }
      comprobarFila(numero,someCLicked){
        var parrafos = Array.from(document.querySelectorAll('p'))
        var i = parseInt((parrafos.indexOf(someCLicked))/9);
        for(var j=0;j<this.columnas;j++){
          if(this.tablero[i][j]===numero){
            return false
          }
        }
        return true

      }
      comprobarColumna(numero,someCLicked){
        var parrafos = Array.from(document.querySelectorAll('p'))
        var j = (parrafos.indexOf(someCLicked))%9;
        for(var i=0;i<this.filas;i++){
          if(this.tablero[i][j]===numero){
            return false
          }
        }
        return true

      }
      comprobarConjunto(numero,someCLicked){
        var parrafos = Array.from(document.querySelectorAll('p'))
        var pr=parrafos.indexOf(someCLicked)
        var i = parseInt((parrafos.indexOf(someCLicked))/9);
        var j = (parrafos.indexOf(someCLicked))%9;
        var ii=i - i%3
        var jj=j - j %3
        for(var fila=0;fila<3;fila++){
          for(var col=0;col<3;col++){
            if((this.tablero[ii+fila][jj+col])===numero){
              return false
            }
          }
        }

       
        this.tablero[i][j]=numero;
        return true
      }
    }

