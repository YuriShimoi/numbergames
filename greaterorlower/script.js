let _score = 0;
let _highscore = 0;

function changeNumber(newNumber, guessResult=null) {
    let numberElement = document.getElementById("number");
    numberElement.innerHTML = newNumber < 100? newNumber < 10? '00' + newNumber: '0' + newNumber: newNumber;
    if(guessResult !== null) {
        numberElement.classList.add(["roll-down", "roll-up"][guessResult]);
        setTimeout(() => {
            numberElement.classList.remove("roll-down", "roll-up");
        }, 120);
    }
}

function generateNewNumber() {
    let numberElement = document.getElementById("number");
    if(numberElement.innerHTML === "000") {
        changeNumber(Math.round((Math.random() * 998) + 1));
    }
    else {
        let previous = Number(numberElement.innerHTML);
        let next = 0;
        do {
            next = Math.round((Math.random() * 998) + 1);
        } while(previous == next);

        let result = previous > next? 0: 1;
        changeNumber(next, result);
        document.getElementById("guess-result").innerHTML = ['LOWER','GREATER'][result];
        return result;
    }
}

function guessNumber(guess) {
    if(guess == generateNewNumber()) {
        _score++;
        document.getElementById("score").innerHTML = _score;
    }
    else {
        if(_score > _highscore) {
            _highscore = _score;
            document.getElementById("highscore").innerHTML = _highscore;
            localStorage.setItem('highscore', _highscore);
        }
        _score = 0;
        document.getElementById("score").innerHTML = 0;
    }
}

function loadStorage() {
    let saved_score = localStorage.getItem('highscore');
    if(saved_score !== null) {
        _highscore = Number(saved_score);
        document.getElementById("highscore").innerHTML = _highscore;
    }
}

generateNewNumber();
loadStorage();
