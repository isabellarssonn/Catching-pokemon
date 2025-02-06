const log = (msg) => console.log(msg);
const backgroundMusic = document.querySelector("#backgroundMusic")

// I denna fil skriver ni all er kod

let formRef = document.querySelector("#form")
let pokemonFieldRef = document.querySelector("#pokemonField")
let highScoreRef = document.querySelector("#highScore")

formRef.addEventListener("submit", (event) => {
    
    event.preventDefault()
    
    if(validateLogin()) {
        formRef.classList.add("hide")
        pokemonFieldRef.classList.remove("hide")
        console.log("Vidare till spelplanen")
        oGameData.startTimeInMilliseconds();
        document.querySelector("#errormsg").classList.add("hide")
        let backgroundRef = document.querySelector("#background")
        backgroundRef.src = "/assets/arena-background.png"
        startGame()
        backgroundMusic.play();
    }

}) 

function validateLogin() {

let nickRef = document.querySelector("#nick").value
let ageRef = document.querySelector("#age").value
let boyRef = document.querySelector("#boy")
let girlRef = document.querySelector("#girl")

    try {

        if (!(nickRef.length >= 5 && !ageRef.length <= 10)){
            throw new Error("Your name must be between 5 and 10 characters long.")   
        } else if (!(ageRef >= 10 && ageRef <= 15)) {
            throw new Error("Age must be between 10 and 15 years.")
        } else if (!boyRef.checked && !girlRef.checked) {
            throw new Error("You must choose a gender.")
        }

    } catch(error) {
        document.querySelector("#errormsg").classList.remove("hide")
        document.querySelector("#errormsg").textContent = error.message
        return false    
    }

oGameData.trainerName = nickRef
oGameData.trainerAge = ageRef
if (boyRef.checked) {
    oGameData.trainerGender = "Boy";
} else if (girlRef.checked) {
    oGameData.trainerGender = "Girl";
}
    
return true
}

// Spelet
function startGame() {

    getPokemons()
    populateField()    
    
    setInterval(() => {
        oGameData.pokemonNumbers.forEach(pokemon => randomPosition(pokemon.idCSS));
    }, 3000);
    
    document.querySelectorAll("#pokemonField img").forEach(pokemon => {
        pokemon.addEventListener("mouseenter", () => {
            
            if (pokemon.src.includes("png")){
                pokemon.src = pokemon.dataset.ballImg
                let foundPokemon = oGameData.pokemonNumbers.find(p => p.idCSS === pokemon.id)
                if (foundPokemon) {
                    foundPokemon.free = false
                    oGameData.nmbrOfCaughtPokemons++    
                }
            } else {
                pokemon.src = pokemon.dataset.defaultImg
                let releasedPokemon = oGameData.pokemonNumbers.find(p => p.idCSS === pokemon.id)
                if (releasedPokemon) {
                    releasedPokemon.free = true
                    oGameData.nmbrOfCaughtPokemons-- 
                }
            }
            if (oGameData.pokemonNumbers.every(p => p.free === false)){
                pokemonFieldRef.classList.add("hide")
                highScoreRef.style.display = "flex"
                highScoreRef.classList.remove("hide")
                oGameData.endTimeInMilliseconds();
                let elapsedTime = oGameData.nmbrOfMilliseconds();
                console.log("Tid för att fånga alla Pokémon: " + elapsedTime + " ms")
                saveScore()
                showHighscore()
            }
        })
    }) 
    }

// Skapar en array med 10 slumpade pokémon
function getPokemons() {
    
    let allPokemonNumbers = []

    for (let i = 1; i <= 151; i++){ 
        allPokemonNumbers.push(i.toString())
    }

    allPokemonNumbers = allPokemonNumbers.map((number) => {
        if (number.length === 1) {
            return `00${number}`
            console.log(number);  
        } else if (number.length === 2) {
            return `0${number}`
        } else {
            return number
        }
    })
    
    shuffleArray(allPokemonNumbers)

    oGameData.pokemonNumbers = allPokemonNumbers.slice(0, 10)
    
    oGameData.pokemonNumbers = oGameData.pokemonNumbers.map(number => ({
        id: number.toString(),  
        imageUrl: `/assets/pokemons/${number.toString()}.png`,
        idCSS: `poke${number}`,
        ballImg: `/assets/ball.webp`,
        free: true  
    }))
    
}

// Sätter 10 Pokémon på spelplanen
function populateField() {
    
    for (let i = 0; i < 10; i++) {
        let newPokemon = document.createElement("img")
        let pokemon = oGameData.pokemonNumbers[i]
        
        newPokemon.id = pokemon.idCSS
        newPokemon.src = pokemon.imageUrl
        newPokemon.dataset.ballImg = pokemon.ballImg
        newPokemon.dataset.defaultImg = pokemon.imageUrl
        newPokemon.style.left = `${oGameData.getLeftPosition()}px`
        newPokemon.style.top = `${oGameData.getTopPosition()}px`

        pokemonFieldRef.appendChild(newPokemon)
    }
}

// Sätter slumpad position för pokemon baserat på id
function randomPosition(pokemonId) {
    let pokemonRef = document.querySelector("#"+pokemonId)
    pokemonRef.style.left = `${oGameData.getLeftPosition()}px`
    pokemonRef.style.top = `${oGameData.getTopPosition()}px`
}

// Funktion för att blanda en array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//sparar namn och tid i localstorage
function saveScore() {
    let elapsedTime = oGameData.nmbrOfMilliseconds();
    localStorage.setItem(oGameData.trainerName, elapsedTime);
  }
  
//visar highscore
function showHighscore() {
    let scoreTable = document.querySelector("#highscoreList");
    let highscore = [];
        for (let i = 0; i < localStorage.length; i++) {
        highscore.push({
        name: localStorage.key(i),
        time: localStorage.getItem(localStorage.key(i)),
      });
      highscore.sort((a, b) => a.time - b.time);
      scoreTable.innerHTML = highscore
        .map((player) => `<li>${player.name}: ${player.time}</li>`)
        .join("");
    }
  }


// Startar om
let restartRef = document.querySelector("#playAgainBtn")

restartRef.addEventListener("click", () => {
    oGameData.init()
    pokemonFieldRef.innerHTML = ""
    highScoreRef.classList.add("hide")
    highScoreRef.style.display = "none"
    formRef.classList.remove("hide")
    document.querySelector("#background").src= "/assets/background.png"
    let backgroundRef = document.querySelector("#background")
    backgroundRef.src = "/assets/background.png"
    backgroundMusic.pause(); // Pausar musiken
    backgroundMusic.currentTime = 0; // Startar om från början
    let nickRef = document.querySelector("#nick")
    let ageRef = document.querySelector("#age")
    let boyRef = document.querySelector("#boy")
    let girlRef = document.querySelector("#girl")
    nickRef.value = ""
    ageRef.value = ""
    boyRef.checked = false
    girlRef.checked = false
})
