const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod
let activePokemons = []

//Form validation
let formRef = document.querySelector('#form');
formRef.addEventListener('submit', (event) => {
    event.preventDefault()
    if (validateLogin()) {
        console.log('Formuläret skickades');
        formRef.classList.add('hide');
    }
})

// Form validation function
function validateLogin() {
    let nickRef = document.querySelector('#nick').value;
    let ageRef = document.querySelector('#age').value;
    let boyRef = document.querySelector('#boy');
    let girlRef = document.querySelector('#girl');

    try {
        if (nickRef.length <= 5 || nickRef.length >= 10) {
            throw new Error('Namnet måste vara mellan 5 och 10 tecken långt.');
        } else if (ageRef < 10 || ageRef > 15) {
            throw new Error('Åldern måste vara mellan 10 och 15 år.');
        } else if (!boyRef.checked && !girlRef.checked) {
            throw new Error('Ett av alternativen måste vara ikryssat.')
        }

    } catch(error) {
        let errorRef = document.querySelector('#error');
        errorRef.textContent = error.message
        console.log(error.message);
        return false
    }
    return true
}

// Slumpa 10 random pokémon
function getPokemons() {

    let pokemonNumbers = []

    for (let i = 1; i <= 151; i++) {
        pokemonNumbers.push(i.toString()) 
    }
    
    pokemonNumbers = pokemonNumbers.map((number) => {
        if (number.length === 1) {
            return `00${number}`
        } else if (number.length === 2){
            return `0${number}`
        } else {
            return number
        }
    })

    shuffleArray(pokemonNumbers)

    let randomPokemonNumbers = pokemonNumbers.slice(0, 10)

    console.log(randomPokemonNumbers);

    activePokemons = randomPokemonNumbers.map(number => ({
        idCss: `poke${number}`,
        imageUrl: `/assets/pokemons/${number.toString()}.png`,
        ballImg: `/assets/ball.webp`
    }))

    console.log(activePokemons);
    
}

// Funktion för att blanda en array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


getPokemons()
