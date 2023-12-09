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
        var h2 = document.createElement('h2')
        h2.textContent='¡ Aprende los sonidos de los animales !'
        section.appendChild(h2)
        var body = document.querySelector('body')

        for (let i = 0; i < this.animals.length; i++) {
            let figure = document.createElement('figure')
            figure.setAttribute("data-state", "default")
            let img = document.createElement("img");
            img.setAttribute("src", './multimedia/' + this.animals[i] + '.png');
            img.setAttribute("alt", this.animals[i]);
            figure.appendChild(img);
            figure.addEventListener("dragstart", (e) => this.handleDragStart(e, i,figure));
            figure.addEventListener("dragover", (e) => this.handleDragOver(e)); 
            section.appendChild(figure);
        }

        for (let i = 0; i < this.boxes.length; i++) {
            let figure = document.createElement('figure')
            figure.setAttribute("data-state", "default")
            var img = document.createElement("img");
            img.setAttribute("src", './multimedia/jaula.png');
            img.setAttribute("alt", 'jaula' + (i + 1));
            figure.appendChild(img);
            figure.addEventListener("click", () => this.playSound(i,figure))
            figure.addEventListener("dragover", (e) => this.handleDragOver(e)); 
            figure.addEventListener("drop", (e) => this.handleDrop(e, figure));
            section.appendChild(figure);
        }

        body.append(section)
 
    }
    iniciarAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSound(i,figure) {
        var figureSound = document.querySelectorAll('figure[data-state="sound"]')
        if(figureSound.length===0 && figure.dataset.state!=="correct"){
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
                figure.setAttribute("data-state","sound")
                soundSource.onended = () => {
                    figure.setAttribute("data-state","default")
                };
               
                soundSource.start()
                
            })
            .catch(error => console.error("Error loading audio file", error));
        }
        
       
    }

    

    handleDragStart(event, i,figure) {
         localStorage.setItem("selectedAnimal", i);
         figure.setAttribute("data-state","draged")
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDrop(event, figure) {
        event.preventDefault();
        const animalIndex = parseInt(event.dataTransfer.getData("text/plain"));
        const boxIndex = Array.from(document.querySelectorAll('figure')).indexOf(event.currentTarget)
        const selectedAnimal = localStorage.getItem("selectedAnimal");
        var figureDraged = document.querySelector('figure[data-state="draged"]')
        if(!(figure.dataset.state==="correct" || figureDraged.dataset.state==="correct")){
        if (this.animals[selectedAnimal] === this.boxes[boxIndex-3]) {
            alert("¡Correcto!")
            
            figureDraged.lastChild.setAttribute("src","./multimedia/tick.png")
            figure.lastChild.setAttribute("src","./multimedia/tick.png")
            figureDraged.setAttribute("data-state","correct")
            figure.setAttribute("data-state","correct")
        } else {
            alert("Incorrecto. Intenta de nuevo.")
            figureDraged.setAttribute("data-state","default")
        }
        
        localStorage.removeItem("selectedAnimal");
    }
    }
}