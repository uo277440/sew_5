
class Crucigrama{
    constructor(){
        this.board="4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-"+
        ",.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-"+
        ",#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16"
        this.board2="4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-"+
        ",.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-"+
        ",.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72"
        this.filas=11
        this.columnas=9
        this.boardArray
        this.init_time
        this.end_time
        this.startedTime=false
        this.boardArray=new Array(this.filas)
        for (var i = 0; i < this.boardArray.length; i++) {
            this.boardArray[i] = new Array(this.columnas);
          }
          this.start()
          this.paintMathword()
          this.nivel="facil"
          this.server="localhost"
          this.user="DBUSER2023"
          this.pass="DBPSWD2023"
          this.dbname="records"
    }
    start(){
        var pos = 0
        var cadenaSinComas=this.board.split(',')
        for (var i = 0; i < this.filas; i++) {
            for (var j = 0; j < this.columnas; j++) {
              if(cadenaSinComas[pos]==="."){
                this.boardArray[i][j]='0';
              }else if(cadenaSinComas[pos]==="#"){
                this.boardArray[i][j]='-1';
              }else{
                this.boardArray[i][j]=cadenaSinComas[pos];
              }
              pos++
            }
          }
    }
    paintMathword(){
        
       var section = $("<section data-type='crucigrama'></section>")
       var h2 = $("<h2>Crucigrama</h2>")
       section.append(h2)
        for (var i = 0; i < this.filas; i++) {
          for (var j = 0; j < this.columnas; j++) {
            var p = document.createElement('p');
            if(this.boardArray[i][j]==="0"){
                p.addEventListener('click',this.click.bind(p));
                p.setAttribute("data-state","default")
              }else if(this.boardArray[i][j]==="-1"){
                p.setAttribute("data-state","empty")
              }else{
                p.textContent=this.boardArray[i][j]
                p.setAttribute("data-state","blocked")
              }
            
            section.append(p);
            
          }
        }
        $('main').append(section)
       // this.init_time = new Date();
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
    check_win_condition(){
        for (var i = 0; i < this.filas; i++) {
            for (var j = 0; j < this.columnas; j++) {
                if(this.boardArray[i][j]==='0'){
                    return false
                }
              
            }
          }
          return true
    }
    calculate_date_difference(){
        this.end_time=new Date()
        const time_difference = this.end_time - this.init_time;

        const hours = Math.floor(time_difference / 3600000);
        const minutes = Math.floor((time_difference % 3600000) / 60000);
        const seconds = Math.floor((time_difference % 60000) / 1000);

        const formatted_time = `${hours}:${minutes}:${seconds}`;
        this.tiempo=seconds+hours*3600+minutes*60
        return formatted_time;

    }
    introduceElement(numero){
      if(!isNaN(numero) || ['+', '-', '*', '/'].includes(numero)){
        var expression_row=true
        var expression_col=true
        var someclicked = $("p[data-state='clicked']")[0]
        var parrafos = Array.from($('section[data-type="crucigrama"] p'))
        var indice=parrafos.indexOf(someclicked)
        var i = parseInt(indice/9);
        var j = (indice)%9;
        this.boardArray[i][j]=numero
        if(this.comprobarHorizontal(i,j) && this.comprobarVertical(i,j)){
          if(!this.startedTime){
            this.init_time = new Date();
            this.startedTime = true
          }
          
          someclicked.setAttribute("data-state","correct")
          someclicked.textContent=this.boardArray[i][j]
        }else{
          this.boardArray[i][j]="0"
          someclicked.setAttribute("data-state","default")
          alert("Incorrecto")
        }
        if(this.check_win_condition()){
          alert("Crucigrama completado en "+this.calculate_date_difference())
          this.createRecordForm()
        }
    }
  }
  comprobarHorizontal(i,j){
    var j_s=j+1;
    if(j_s>this.columnas-1){
      return true
    }
    while(this.boardArray[i][j_s]!=='='){
      if(this.boardArray[i][j_s]==='-1'){
        return true
      }
      j_s++
    }
    var first_number=this.boardArray[i][j_s-3]
    var second_number=this.boardArray[i][j_s-1]
    var expression=this.boardArray[i][j_s-2]
    var result=this.boardArray[i][j_s+1]
    if(!(!(isNaN(parseInt(first_number))) || first_number==='0')){
      console.log("a")
    }if(!(!isNaN(parseInt(second_number)) || second_number==='0')){
      console.log("b")
    }if(!(!isNaN(parseInt(second_number)) || second_number==='0')){
      console.log("c")
    }if(!((['+', '-', '*', '/'].includes(expression) || expression===0))){
      console.log("d")
    }
    if(!(!isNaN(parseInt(first_number)) || first_number==='0') || !(!isNaN(parseInt(second_number)) || second_number==='0') || !(!isNaN(parseInt(result)) || result==='0') || !((['+', '-', '*', '/'].includes(expression) || expression==='0'))){
      return false;
    }
    if(first_number==='0' || second_number==='0' || result==='0' || expression==='0'){
      return true
    }
    var expresion_matematica = [first_number,expression,second_number].join(" ")
    
    if(eval(expresion_matematica)===parseInt(result)){
      return true
    }else{
      return false
    }
  }
  comprobarVertical(i,j){
    var i_s=i+1;
    if(i_s>this.filas-1){
      return true
    } 
    while(this.boardArray[i_s][j]!=='='){
      if(this.boardArray[i_s][j]==='-1'){
        return true
      }
      i_s++
    }
    var first_number=this.boardArray[i_s-3][j]
    var second_number=this.boardArray[i_s-1][j]
    var expression=this.boardArray[i_s-2][j]
    var result=this.boardArray[i_s+1][j]
    if(!(!(isNaN(parseInt(first_number))) || first_number==='0')){
      console.log("a")
    }
    if(!(!(isNaN(parseInt(first_number))) || first_number==='0') || !(!(isNaN(parseInt(second_number))) || second_number==='0') || !(!(isNaN(parseInt(result))) || result==='0') || !((['+', '-', '*', '/'].includes(expression) || expression==='0'))){
      return false;
    }
    if(first_number==='0' || second_number==='0' || result==='0' || expression==='0'){
      return true
    }
    var expresion_matematica = [first_number,expression,second_number].join(" ")
    if(eval(expresion_matematica)===parseInt(result)){
      return true
    }else{
      return false
    }
  }
  createRecordForm() {
    var formContent = `
        <form action='#' method='post' name='calculadora'>
            <label for='nombre'>Nombre:</label>
            <input type='text' name='nombre' value='' required/>

            <label for='apellidos'>Apellidos:</label>
            <input type='text' name='apellidos' value='' required/>

            <label for='nivel'>Nivel:</label>
            <input type='text' name='nivel' readonly value='${this.nivel}'/>

            <label for='tiempo'>Tiempo(s):</label>
            <input type='text' name='tiempo' readonly value='${this.tiempo}'/>

            <input type='submit' value='Enviar' name="insertarRecord"/>
        </form>
    `;
    var h2 = $('<h2>').text('Formulario de registro de record');
    var section = $('<section>').append(h2).append(formContent);
    $('body').append(section);
}
}