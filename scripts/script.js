const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod

let formRef = document.querySelector('#form');
formRef.addEventListener('submit', (event) => {
    event.preventDefault()
    if (validateLogin()) {
        console.log('Formuläret skickades');
        formRef.classList.add('hide');
    }
})

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

