class Api {
    constructor() {
        this.audioContext = null;
        this.animals = ["perro", "oveja", "burro"];
        this.boxes = ["oveja", "burro", "perro"];
        this.shuffleBoxes()
        this.shuffleAnimals()
        this.dibujarTablero();
    }
    shuffleBoxes() {
        for (let i = this.boxes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.boxes[i], this.boxes[j]] = [this.boxes[j], this.boxes[i]];
        }
    }
    shuffleAnimals() {
        for (let i = this.boxes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.animals[i], this.animals[j]] = [this.animals[j], this.animals[i]];
        }
    }

    dibujarTablero() {
        var section = document.createElement('section')
        var body = document.querySelector('body')

        for (let i = 0; i < this.animals.length; i++) {
            let article = document.createElement('article')
            article.setAttribute("data-state", "default")
            let img = document.createElement("img");
            img.setAttribute("src", './multimedia/' + this.animals[i] + '.png');
            img.setAttribute("alt", this.animals[i]);
            article.appendChild(img);
            article.addEventListener("dragstart", (e) => this.handleDragStart(e, i,article));
            article.addEventListener("dragover", (e) => this.handleDragOver(e)); 
            section.appendChild(article);
        }

        for (let i = 0; i < this.boxes.length; i++) {
            let article = document.createElement('article')
            article.setAttribute("data-state", "default")
            var img = document.createElement("img");
            img.setAttribute("src", './multimedia/jaula.png');
            img.setAttribute("alt", 'jaula' + (i + 1));
            article.appendChild(img);
            article.addEventListener("click", () => this.playSound(i,article))
            article.addEventListener("dragover", (e) => this.handleDragOver(e)); 
            article.addEventListener("drop", (e) => this.handleDrop(e, article));
            section.appendChild(article);
        }

        body.append(section)
 
    }
    iniciarAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSound(i,article) {
        var articleSound = document.querySelectorAll('article[data-state="sound"]')
        if(articleSound.length===0 && article.dataset.state!=="correct"){
        if (!this.audioContext) {
            this.iniciarAudioContext();
        }
       
        const soundSource = this.audioContext.createBufferSource();
        const sound = this.boxes[i];

        
        const audioFile = './multimedia/' + sound + '.mp3';
        fetch(audioFile)
            .then(response => response.arrayBuffer())
            .then(buffer => this.audioContext.decodeAudioData(buffer))
            .then(decodedData => {
                soundSource.buffer = decodedData;
                soundSource.connect(this.audioContext.destination);
                article.setAttribute("data-state","sound")
                soundSource.onended = () => {
                    article.setAttribute("data-state","default")
                };
               
                soundSource.start()
                
            })
            .catch(error => console.error("Error loading audio file", error));
        }
        
       
    }

    

    handleDragStart(event, i,article) {
         localStorage.setItem("selectedAnimal", i);
         article.setAttribute("data-state","draged")
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDrop(event, article) {
        event.preventDefault();
        const animalIndex = parseInt(event.dataTransfer.getData("text/plain"));
        const boxIndex = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget)
        const selectedAnimal = localStorage.getItem("selectedAnimal");
        var articleDraged = document.querySelector('article[data-state="draged"]')
        if(!(article.dataset.state==="correct" || articleDraged.dataset.state==="correct")){
        if (this.animals[selectedAnimal] === this.boxes[boxIndex-3]) {
            alert("¡Correcto!")
            
            articleDraged.lastChild.setAttribute("src","./multimedia/tick.png")
            article.lastChild.setAttribute("src","./multimedia/tick.png")
            articleDraged.setAttribute("data-state","correct")
            article.setAttribute("data-state","correct")
        } else {
            alert("Incorrecto. Intenta de nuevo.")
            articleDraged.setAttribute("data-state","default")
        }
        
        localStorage.removeItem("selectedAnimal");
    }
    }
}