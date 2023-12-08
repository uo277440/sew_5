
class Memoria{

    

    tablero = {
        "tarjeta1": {
            "elemento": "HTML5",
            "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
        },
        "tarjeta2": {
            "elemento": "HTML5",
            "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
        },
        "tarjeta3": {
            "elemento": "CSS3",
            "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
        },
        "tarjeta4": {
            "elemento": "CSS3",
            "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
        },
        "tarjeta5": {
            "elemento": "JS",
            "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
        },
        "tarjeta6": {
            "elemento": "JS",
            "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
        },
        "tarjeta7": {
            "elemento": "PHP",
            "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
        },
        "tarjeta8": {
            "elemento": "PHP",
            "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
        },
        "tarjeta9": {
            "elemento": "SVG",
            "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
        },
        "tarjeta10": {
            "elemento": "SVG",
            "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
        },
        "tarjeta11": {
            "elemento": "W3C",
            "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
        },
        "tarjeta12": {
            "elemento": "W3C",
            "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
        },
        
    };
    flipCard(game) {
        if(this.getAttribute("data-state")==="revealed"){
            return
        }
        if(this.getAttribute("data-state")==="flip"){
            return
        }
        if(game.firstCard!== null && game.secondCard!==null){
            return
        }
    
        if(!game.lockBoard){
            
            if(game.firstCard==null){
                game.firstCard=this.lastChild.getAttribute('alt')
                this.lastChild.hidden = false;
                this.setAttribute("data-state","flip")
                //this.classList.add('flip');
      
            }else{
                game.secondCard=this.lastChild.getAttribute('alt')
                this.lastChild.hidden = false;
                this.setAttribute("data-state","flip")
                //this.classList.add('flip');
                setTimeout(() => {
                    game.checkForMatch();
                  }, "2000");
            }
            
        }
    
        console.log(this.lastChild.getAttribute("alt"));
        
      }
    constructor (){
        this.hasFlippedCard=false;
        this.lockBoard=false;
        this.firstCard=null;
        this.secondCard=null;
        this.shuffleElements()
        this.createElements()
        const articles = document.querySelectorAll('article');
        for (var i = 0; i < articles.length; i++) {
            articles[i].addEventListener('click',this.flipCard.bind(articles[i],this));
          }
        
    }
    shuffleElements(){
    var keys = Object.keys(this.tablero);
    for (var i = keys.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var save = this.tablero[keys[i]];
        this.tablero[keys[i]] = this.tablero[keys[j]];
        this.tablero[keys[j]] = save;
    }
    }
    unflipCards(){
        var cards=document.querySelectorAll('article[data-state="flip"]')
        for (var i = 0; i < cards.length; i++) {
            cards[i].dataset.state = "default";

          //  cards[i].classList.remove('flip');

            cards[i].lastChild.hidden=true;
          }
        this.resetBoard();
    }
    disableCards(){
        var cards=document.querySelectorAll('article[data-state="flip"]')
        for (var i = 0; i < cards.length; i++) {
            cards[i].dataset.state = "revealed";
           
          }
        this.resetBoard();
    }
    resetBoard(){
        this.firstCard=null;
        this.secondCard=null;
        this.hasFlippedCard=false;
        this.lockBoard=false;
    }
    checkForMatch(){
        if(this.firstCard===this.secondCard){
            this.disableCards();
        }else{
            this.unflipCards()
        }
    }
    // Método para crear nodos article en el documento HTML
    createElements() {
        var section = document.createElement('section')
        var body = document.querySelector('body');
        var titulo = document.createElement('h2')
        titulo.textContent = 'JUEGO DE MEMORIA'
        section.appendChild(titulo)
    for (var e in this.tablero) {
            var tarjeta = this.tablero[e];

            var article = document.createElement("article");

            article.setAttribute("data-element", tarjeta.elemento); 
            article.setAttribute("data-state", "default"); 
       

            var h3 = document.createElement("h3");
            h3.textContent = "Tarjeta de memoria";
            article.appendChild(h3);         

            var img = document.createElement("img");
            img.setAttribute("src", tarjeta.source);
            img.setAttribute("alt", tarjeta.elemento);
            img.setAttribute("hidden",true);
            article.appendChild(img); 
            
            section.appendChild(article);

            
    }
    body.append(section)
}



 
  
  

}


