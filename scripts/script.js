const log = (msg) => console.log(msg);
//gömmer highscore tabellen vid start
let scoreTable = document.querySelector("#highScore");
scoreTable.classList.add("hide");

// Moq data för att testa highscore
localStorage.clear();
localStorage.setItem("Ash", 25);
localStorage.setItem("Brock", 20);
localStorage.setItem("Misty", 30);
localStorage.setItem("Jessie", 40);
localStorage.setItem("Pikachu", 22);

// I denna fil skriver ni all er kod för spelet
let activePokemons = [];
getPokemons();
populateField();

//Form validation
let formRef = document.querySelector("#form");
formRef.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateLogin()) {
    console.log("Formuläret skickades");
    startTimer();
    formRef.classList.add("hide");
  }
});

// Form validation function
function validateLogin() {
  let nickRef = document.querySelector("#nick").value;
  let ageRef = document.querySelector("#age").value;
  let boyRef = document.querySelector("#boy");
  let girlRef = document.querySelector("#girl");

  try {
    if (nickRef.length <= 5 || nickRef.length >= 10) {
      throw new Error("Namnet måste vara mellan 5 och 10 tecken långt.");
    } else if (ageRef < 10 || ageRef > 15) {
      throw new Error("Åldern måste vara mellan 10 och 15 år.");
    } else if (!boyRef.checked && !girlRef.checked) {
      throw new Error("Ett av alternativen måste vara ikryssat.");
    }
  } catch (error) {
    let errorRef = document.querySelector("#error");
    errorRef.textContent = error.message;
    console.log(error.message);
    return false;
  }
  return true;
}

// Slumpa 10 random pokémon
function getPokemons() {
  let pokemonNumbers = [];

  for (let i = 1; i <= 151; i++) {
    pokemonNumbers.push(i.toString());
  }

  pokemonNumbers = pokemonNumbers.map((number) => {
    if (number.length === 1) {
      return `00${number}`;
    } else if (number.length === 2) {
      return `0${number}`;
    } else {
      return number;
    }
  });

  shuffleArray(pokemonNumbers);

  let randomPokemonNumbers = pokemonNumbers.slice(0, 10);

  console.log(randomPokemonNumbers);

  activePokemons = randomPokemonNumbers.map((number) => ({
    idCss: `poke${number}`,
    imageUrl: `/assets/pokemons/${number.toString()}.png`,
    ballImg: `/assets/ball.webp`,
  }));

  console.log(activePokemons);
}

// Funktion för att blanda en array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Place 10 Pokémon on game field
function populateField() {
  for (let i = 0; i < 10; i++) {
    
    let newPokemon = document.createElement("img");
    console.log(newPokemon);
    let pokemon = activePokemons[i];

    newPokemon.id = pokemon.idCss;
    newPokemon.src = pokemon.imageUrl;
    newPokemon.style.left = `${oGameData.getLeftPosition()}px`
    newPokemon.style.top = `${oGameData.getTopPosition()}px`

    console.log(newPokemon);

    let gameFieldRef = document.querySelector("#gameField");
    gameFieldRef.appendChild(newPokemon);
    newPokemon.addEventListener('mouseover', () => handleHover(newPokemon, pokemon));
  }
  stopTimer();
}

function randomPosition(pokemonId) {
  let pokemonRef = document.querySelector("#"+pokemonId)
  pokemonRef.style.left = `${oGameData.getLeftPosition()}px`
  pokemonRef.style.top = `${oGameData.getTopPosition()}px`
}

setInterval(() => {
  activePokemons.forEach(pokemon => randomPosition(pokemon.idCss));
}, 3000);

// Timer
let timer;
let counter = 0;

function startTimer() {
  oGameData.endTime = setInterval(() => {
    console.log("Counter: " + counter);
    return counter++;
  }, 1);
}

function stopTimer() {
  clearInterval(oGameData.endTime);
  console.log("Counter: " + oGameData.endTime);
}

//sparar namn och tid i localstorage
function saveScore() {
  localStorage.setItem(oGameData.trainerName, oGameData.endTime);
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

function handleHover(pokemonElement, pokemonData) {
    if (!pokemonData.caught) {
        pokemonElement.src = pokemonData.ballImg;  // byter til Pokéboll-bild
        pokemonData.caught = true;                 // bockar i att den är fången

        // event för att låta Pokémon rymma när man hovrar över bollen
        pokemonElement.addEventListener('mouseover', () => handleEscape(pokemonElement, pokemonData), { once: true });
    }
}

function handleEscape(pokemonElement, pokemonData) {
    pokemonElement.src = pokemonData.imageUrl;    // tillbaka till pokemon bilden
    pokemonData.caught = false;                   // bockar i att den ej är fången

    randomPosition(pokemonElement.id);            // Pokémon får en nu position och röra sig mot 
}