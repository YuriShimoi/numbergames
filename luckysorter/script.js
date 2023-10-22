const places = document.getElementById("places").querySelectorAll("span");

let timerInterval = null;

let _timer = 0;
let _number = 0;
let _placelist = new Array(20).fill(null);

let _highscore = 0;

function generateNewNumber() {
    const formatNum = (num) => {
        return num < 100? num < 10? '00' + num: '0' + num: num;
    };

    let numberElement = document.getElementById("number");

    if(numberElement.innerHTML === "000") {
        newNumber = Math.round((Math.random() * 998) + 1);
        numberElement.innerHTML = formatNum(newNumber);
    }
    else {
        let previous = Number(numberElement.innerHTML);
        let next = 0;
        do {
            next = Math.round((Math.random() * 998) + 1);
        } while(previous == next || _placelist.includes(formatNum(next)));

        numberElement.innerHTML = formatNum(next);
    }

    _number = numberElement.innerHTML;
    setNextVal();
}

function setNextVal() {
    for(const place of places) {
        place.setAttribute("next-value", _number);
    }
}

function bindPlaces() {
    for(const p in places) {
        const place = places[p];
        place.onclick = () => {
            if(timerInterval === null) {
                startTimer();
            }

            place.classList.add("filled");
            place.innerHTML = _number;
            _placelist[p] = _number;

            if(_placelist.includes(null)) {
                generateNewNumber();
            }
            else {
                stopTimer();
                fillPlacesLabel();
                calculateScore();
                document.getElementById("reset-btn").removeAttribute("disabled");
            }

            place.onclick = undefined;
        };
    }
}

function startTimer() {
    const timer = document.getElementById("timer");
    const formatNum = (num) => num < 10? '0'+num: num;

    _timer = 0;
    timerInterval = setInterval(() => {
        _timer++;
        let minutes = Math.floor(Math.floor(_timer / 100) / 60);
        let seconds = Math.floor(_timer / 100) % 60;
        let millis = _timer % 100;

        timer.innerHTML = `${minutes}:${formatNum(seconds)}.${formatNum(millis)}`;
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function clearPlacesLabel() {
    for(const place of places) {
        place.setAttribute("ordened-label", '');
        place.classList.remove("right-order");
    }
}

function fillPlacesLabel() {
    let ordened = [..._placelist].sort();

    for(let p=0; p < places.length; p++) {
        const place = places[p];
        place.setAttribute("ordened-label", ordened[p]);
        if(ordened[p] == _placelist[p]) {
            place.classList.add("right-order");
        }
    }
}

function calculateScore() {
    let score = 0;

    //#region [SCORE BY PLACE AND SEQUENCE]
    let ordened = [..._placelist].sort();
    for(let o=0; o < ordened.length; o++) {
        o = Number(o);

        if(ordened[o] == _placelist[o]) {
            score += 20;
        }
        if((o+1) < ordened.length && ordened[o+1] == _placelist[_placelist.indexOf(ordened[o])+1]) {
            score += 10;
        }
    }
    //#endregion

    //#region [SCORE BY UNIQUE LAST NUMBER]
    let uniqueFirsts = _placelist.reduce((acc, v) => {if(!acc.includes(v[0])) acc.push(v[0]); return acc;}, []);
    score += uniqueFirsts.length * 10;
    //#endregion

    //#region [SCORE BY TIME]
    if(_timer < (3*60*100)) score += 60;  // 3 minutes
    if(_timer < (  60*100)) score += 100; // 1 minute
    if(_timer < (  30*100)) score += 150; // 30 seconds
    //#endregion

    document.getElementById("score").innerHTML = score;
    if(score > _highscore) {
        _highscore = score;
        document.getElementById("hs-score").innerHTML = _highscore;

        const formatNum = (num) => num < 10? '0'+num: num;

        let minutes = Math.floor(Math.floor(_timer / 100) / 60);
        let seconds = Math.floor(_timer / 100) % 60;
        let millis = _timer % 100;
        document.getElementById("hs-time").innerHTML = `${minutes}:${formatNum(seconds)}.${formatNum(millis)}`;

        localStorage.setItem('luckysorter-hs-val', _highscore);
        localStorage.setItem('luckysorter-hs-time', _timer);
    }
    else if(score == _highscore) {
        const formatNum = (num) => num < 10? '0'+num: num;

        let minutes = Math.floor(Math.floor(_timer / 100) / 60);
        let seconds = Math.floor(_timer / 100) % 60;
        let millis = _timer % 100;
        document.getElementById("hs-time").innerHTML = `${minutes}:${formatNum(seconds)}.${formatNum(millis)}`;
        localStorage.setItem('luckysorter-hs-time', _timer);
    }
}

function resetAll() {
    stopTimer();
    if(_timer != 0) generateNewNumber();
    _timer = 0;
    document.getElementById("score").innerHTML = "0";
    document.getElementById("timer").innerHTML = "0:00.00";

    _placelist = new Array(20).fill(null);
    places.forEach(place => {
        place.innerHTML = "";
        place.classList.remove("filled");
    });
    bindPlaces();
    clearPlacesLabel();
}

function loadHighscore() {
    let savedScore = localStorage.getItem('luckysorter-hs-val');
    if(savedScore) {
        _highscore = Number(savedScore);

        document.getElementById("hs-score").innerHTML = _highscore;

        const formatNum = (num) => num < 10? '0'+num: num;

        let savedTime = localStorage.getItem('luckysorter-hs-time');
        let minutes = Math.floor(Math.floor(savedTime / 100) / 60);
        let seconds = Math.floor(savedTime / 100) % 60;
        let millis = savedTime % 100;
        document.getElementById("hs-time").innerHTML = `${minutes}:${formatNum(seconds)}.${formatNum(millis)}`;
    }
}

generateNewNumber();
bindPlaces();
clearPlacesLabel();
loadHighscore();
