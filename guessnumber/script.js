let _number = 0;
let _hints = [];

function generateNewNumber() {
    const formatNum = (num) => {
        return num < 10000? (num < 1000? (num < 100? (num < 10? '0000' + num: '000' + num): '00' + num): '0' + num): String(num);
    };

    let numberElement = document.getElementById("number");

    if(numberElement.innerHTML === "00000") {
        newNumber = Math.round((Math.random() * 99998) + 1);
        numberElement.innerHTML = formatNum(newNumber);
    }
    else {
        let previous = Number(numberElement.innerHTML);
        let next = 0;
        do {
            next = Math.round((Math.random() * 99998) + 1);
        } while(previous == next && _placelist.includes(formatNum(next)));

        numberElement.innerHTML = formatNum(next);
    }

    _number = numberElement.innerHTML;
}

function getHalfPosHint(num, initNum=1, endNum=99999) {
    let hintFunc = () => true;
    let hintLabel = "";

    if(Number(num) < 50001) {
        endNum = 50000;
        hintLabel = "<b>lower</b> than <b>50001</b>";
        hintFunc = (n) => {
            return Number(n) < 50001;
        };
    }
    else {
        initNum = 50001;
        hintLabel = "<b>greater</b> than <b>50000</b>";
        hintFunc = (n) => {
            return Number(n) > 50000;
        };
    }

    return {'hintLabel': hintLabel,'hintFunc': hintFunc, 'init': initNum, 'end': endNum};
}

function getEvenOddMultipleHint(num, initNum=1, stepNum=1) {
    let hintFunc = () => true;
    let hintLabel = "";

    if((Number(num) % 2) == 0) {
        if((Math.random() > 0.5) && ((Number(num) % 4) == 0)) {
            // multiple of 4
            initNum = 4;
            stepNum = 4;
            hintLabel = "is <b>multiple of 4</b>";
            hintFunc = (n) => {
                return (Number(n) % 4) == 0;
            };
        }
        else {
            // even
            initNum = 2;
            stepNum = 2;
            hintLabel = "is <b>an even number</b>";
            hintFunc = (n) => {
                return (Number(n) % 2) == 0;
            };
        }
    }
    else {
        if((Math.random() > 0.6) && ((Number(num) % 3) == 0)) {
            // multiple of 3
            initNum = 3;
            stepNum = 3;
            hintLabel = "is <b>multiple of 3</b>";
            hintFunc = (n) => {
                return (Number(n) % 3) == 0;
            };
        }
        else {
            // odd
            initNum = 1;
            stepNum = 2;
            hintLabel = "is <b>an odd number</b>";
            hintFunc = (n) => {
                return (Number(n) % 2) == 1;
            };
        }
    }
    
    return {'hintLabel': hintLabel,'hintFunc': hintFunc, 'init': initNum, 'step': stepNum};
}

function getPositionHint(num, ignorePos=[]) {
    let hintFunc = () => true;
    let hintLabel = "";

    let rPos = 0;
    do {
        rPos = Math.round(Math.random() * 3);
    } while(ignorePos.includes(rPos));

    let eomRes = getEvenOddMultipleHint(Number(String(num)[rPos]));
    hintFunc = (rn) => {
        return eomRes.hintFunc(Number(String(rn)[rPos]));
    };
    hintLabel = `number on <b>position ${rPos+1}</b> ` + eomRes.hintLabel;

    return {'hintLabel': hintLabel,'hintFunc': hintFunc, 'position': rPos};
}

function getFormulaHint(num) {
    let hintFunc = () => true;
    let hintLabel = "";

    let formulaRes = 0;
    switch(Math.round(Math.random() * 4)) {
        case 0:
            formulaRes = Number(num[0]) * Number(num[1]) + Number(num[2]) + Number(num[3]) * Number(num[4]);
            hintLabel = `the formula <b>n1 * n2 + n3 + n4 * n5</b> results in <b>${formulaRes}</b>`;
            hintFunc = (n) => {
                let nstr = String(n);
                return (Number(nstr[0]) * Number(nstr[1]) + Number(nstr[2]) + Number(nstr[3]) * Number(nstr[4])) == formulaRes;
            };
            break;
        case 1:
            formulaRes = Number(num[0]) * Number(num[1]) - Number(num[2]) + Number(num[3]) - Number(num[4]);
            hintLabel = `the formula <b>n1 * n2 - n3 + n4 - n5</b> results in <b>${formulaRes}</b>`;
            hintFunc = (n) => {
                let nstr = String(n);
                return (Number(nstr[0]) * Number(nstr[1]) - Number(nstr[2]) + Number(nstr[3]) - Number(nstr[4])) == formulaRes;
            };
            break;
        case 2:
            formulaRes = Number(num[0]) - Number(num[1]) * Number(num[2]) - Number(num[3]) + Number(num[4]);
            hintLabel = `the formula <b>n1 - n2 * n3 - n4 + n5</b> results in <b>${formulaRes}</b>`;
            hintFunc = (n) => {
                let nstr = String(n);
                return (Number(nstr[0]) - Number(nstr[1]) * Number(nstr[2]) - Number(nstr[3]) + Number(nstr[4])) == formulaRes;
            };
            break;
        case 3:
            formulaRes = Number(num[0]) - Number(num[1]) + Number(num[2]) * Number(num[3]) - Number(num[4]);
            hintLabel = `the formula <b>n1 - n2 + n3 * n4 - n5</b> results in <b>${formulaRes}</b>`;
            hintFunc = (n) => {
                let nstr = String(n);
                return (Number(nstr[0]) - Number(nstr[1]) + Number(nstr[2]) * Number(nstr[3]) - Number(nstr[4])) == formulaRes;
            };
            break;
        case 4:
            formulaRes = Number(num[0]) * Number(num[1]) - Number(num[2]) * Number(num[3]) + Number(num[4]);
            hintLabel = `the formula <b>n1 * n2 - n3 * n4 + n5</b> results in <b>${formulaRes}</b>`;
            hintFunc = (n) => {
                let nstr = String(n);
                return (Number(nstr[0]) * Number(nstr[1]) - Number(nstr[2]) * Number(nstr[3]) + Number(nstr[4])) == formulaRes;
            };
            break;
    }

    return {'hintLabel': hintLabel,'hintFunc': hintFunc};
}

function getCoupleHint(num) {
    let hintFunc = () => true;
    let hintLabel = "";

    const getRandomPos = (excList=[]) => {
        let rpos = 0;
        do {
            rpos = Math.round(Math.random() * 4);
        }while(excList.includes(rpos));
        return rpos;
    };
    
    let rp1 = getRandomPos();
    let rn1 = Number(String(num)[rp1]);
    let rp2 = getRandomPos([rp1]);
    let rn2 = Number(String(num)[rp2]);

    let formulaRes = 0;
    switch(Math.round(Math.random() * 2)) {
        case 0:
            formulaRes = rn1 + rn2;
            hintLabel = `on <b>n${rp1+1} + n${rp2+1}</b> the result is <b>${formulaRes}</b>`;
            hintFunc = (n) => {
                let nstr1 = Number(String(n)[rp1]);
                let nstr2 = Number(String(n)[rp2]);
                return (nstr1 + nstr2) == formulaRes;
            };
            break;
        case 1:
            formulaRes = rn1 - rn2;
            hintLabel = `on <b>n${rp1+1} - n${rp2+1}</b> the result is <b>${formulaRes}</b>`;
            hintFunc = (n) => {
                let nstr1 = Number(String(n)[rp1]);
                let nstr2 = Number(String(n)[rp2]);
                return (nstr1 - nstr2) == formulaRes;
            };
            break;
        case 2:
            let rp3 = getRandomPos([rp1, rp2]);
            let rn3 = Number(String(num)[rp3]);
            formulaRes = rn1 * rn2 - rn3;
            hintLabel = `on <b>n${rp1+1} * n${rp2+1} - n${rp3+1}</b> the result is <b>${formulaRes}</b>`;
            hintFunc = (n) => {
                let nstr1 = Number(String(n).split('')[rp1]);
                let nstr2 = Number(String(n).split('')[rp2]);
                let nstr3 = Number(String(n).split('')[rp3]);
                return (nstr1 * nstr2 - nstr3) == formulaRes;
            };
            break;
    }

    return {'hintLabel': hintLabel,'hintFunc': hintFunc};
}

function getNoNumberHint(num, numList) {
    let hintFunc = () => true;
    let hintLabel = "";

    num = String(num);
    let numListAux = [...numList];
    numListAux.splice(numListAux.indexOf(Number(num)), 1);
    
    let excNumList = {};
    for(let numl of numListAux) {
        for(let nl of String(numl)) {
            if(nl in excNumList) {
                excNumList[nl]++;
            }
            else if(!num.includes(nl)) {
                excNumList[nl] = 1;
            }
        }
    }

    let mostRpt = Object.keys(excNumList).reduce((res, n) => excNumList[n] > excNumList[res]? n: res);
    hintLabel = `has no <b>${mostRpt}</b> in the number`;
    hintFunc = (n) => {
        return !String(n).includes(String(mostRpt));
    };

    return {'hintLabel': hintLabel,'hintFunc': hintFunc};
}

function getHasNumberHint(num, numList) {
    let hintFunc = () => true;
    let hintLabel = "";

    num = String(num);
    let numListAux = [...numList];
    numListAux.splice(numListAux.indexOf(Number(num)), 1);
    
    let incNumList = num.split('').reduce((acc, n) => {
        acc[n] = 0;
        return acc;
    }, {});

    for(let numl of numListAux) {
        for(let nl of String(numl)) {
            if(nl in incNumList) {
                incNumList[nl]++;
            }
        }
    }

    let lessRpt = Object.keys(incNumList).reduce((res, n) => incNumList[n] <= incNumList[res]? n: res);
    hintLabel = `has at least one <b>${lessRpt}</b> in any position`;
    hintFunc = (n) => {
        return String(n).includes(String(lessRpt));
    };

    return {'hintLabel': hintLabel,'hintFunc': hintFunc};
}

function generateHints() {
    let hintList = [];
    let [initNum, endNum, stepNum] = [1, 99999, 1];
    
    //#region [HalfPosHint]
    let halfHint = getHalfPosHint(_number);
    initNum = halfHint.init;
    endNum = halfHint.end;
    hintList.push({'label': halfHint.hintLabel, 'func': halfHint.hintFunc});
    //#endregion

    //#region [EvenOddMultipleHint]
    let eom = getEvenOddMultipleHint(_number, initNum, endNum, stepNum);
    initNum = initNum == 50001? [, 50001, 50002, 50001, 5004][eom.init]: eom.init;
    stepNum = eom.step;
    hintList.push({'label': eom.hintLabel, 'func': eom.hintFunc});
    //#endregion

    //#region [PositionHint]
    let posHint = getPositionHint(_number);
    hintList.push({'label': posHint.hintLabel, 'func': posHint.hintFunc});
    posHint = getPositionHint(_number, [posHint.position]);
    hintList.push({'label': posHint.hintLabel, 'func': posHint.hintFunc});
    //#endregion

    //#region [CoupleHint]
    let cplHint = getCoupleHint(_number);
    hintList.push({'label': cplHint.hintLabel, 'func': cplHint.hintFunc});
    //#endregion

    //#region [FormulaHint]
    let fmlHint = getFormulaHint(_number);
    hintList.push({'label': fmlHint.hintLabel, 'func': fmlHint.hintFunc});
    //#endregion

    //#region [Hint Loop]
    let validList = [];
    validList = validateHints(hintList.map(h => h.func), initNum, endNum, stepNum);

    let iter = 2;
    do {
        try {
            let nnbHint = getNoNumberHint(_number, validList);
            if(!(hintList.map(h => h.label)).includes(nnbHint.hintLabel)) {
                hintList.push({'label': nnbHint.hintLabel, 'func': nnbHint.hintFunc});
                validList = validateHints(hintList.map(h => h.func), initNum, endNum, stepNum, validList);
            }
        }
        catch {}

        try {
            let hnbHint = getHasNumberHint(_number, validList);
            if(!(hintList.map(h => h.label)).includes(hnbHint.hintLabel)) {
                hintList.push({'label': hnbHint.hintLabel, 'func': hnbHint.hintFunc});
                validList = validateHints(hintList.map(h => h.func), initNum, endNum, stepNum, validList);
            }
        }
        catch {}
    } while(validList.length > 1 && --iter);
    // #endregion

    //#region [Response Hints]
    hintList.push({'label': `number on position 1 is <b>${String(_number)[0]}</b>`, 'func': (n) => String(n)[0] == String(_number)[0]});
    hintList.push({'label': `number on position 2 is <b>${String(_number)[1]}</b>`, 'func': (n) => String(n)[1] == String(_number)[1]});
    hintList.push({'label': `number on position 3 is <b>${String(_number)[2]}</b>`, 'func': (n) => String(n)[2] == String(_number)[2]});
    hintList.push({'label': `number on position 4 is <b>${String(_number)[3]}</b>`, 'func': (n) => String(n)[3] == String(_number)[3]});
    hintList.push({'label': `number on position 5 is <b>${String(_number)[4]}</b>`, 'func': (n) => String(n)[4] == String(_number)[4]});
    //#endregion

    _hints = hintList;
    const hintsElement = document.getElementById("hints");
    let isFirst = true;
    for(const hint of hintList) {
        let hintItem = document.createElement("LI");
        hintItem.innerHTML = hint.label;
        if(isFirst) {
            isFirst = false;
            hintItem.classList.add("revealed");
        }
        else {
            hintItem.onclick = () => {
                hintItem.classList.add("revealed");
                hintItem.onclick = undefined;
            };
        }
        hintsElement.appendChild(hintItem);
    }
}

function validateHints(hints, initNum, endNum, stepNum, specificList=null) {
    // console.log(hints, initNum, endNum, stepNum, specificList);

    const parseHints = (num, hintList, printWhenRemoved=false) => {
        for(const hint of hintList) {
            if(!hint(num)) {
                if(printWhenRemoved) console.warn(num, hint);
                return false;
            }
        }
        return true;
    };
    const formatNum = (num) => {
        num = Number(num);
        return num < 10000? (num < 1000? (num < 100? (num < 10? '0000' + num: '000' + num): '00' + num): '0' + num): String(num);
    };
    
    let validList = [];
    if(specificList === null) {
        for(let n=initNum; n <= endNum; n+=stepNum) {
            if(parseHints(formatNum(n), hints)) {
                validList.push(formatNum(n));
            }
        }
    }
    else {
        for(let n of specificList) {
            if(parseHints(formatNum(n), hints)) {
                validList.push(formatNum(n));
            }
        }
    }
    return validList;
}

function bindNumberValidator() {
    const inputs = [...document.getElementById("input-numbers").children];
    for(const input of inputs) {
        const validateInput = (c) => {
            if(String(input.value).length > 1) input.value = String(input.value)[0];
            if(String(input.value) === " ") input.value = "";
            if(Number.isNaN(Number(input.value))) input.value = "";
        };
        input.onkeyup = validateInput;
        input.onkeydown = validateInput;
        input.onkeypress = validateInput;
        input.onchange = validateInput;
    }
}

function checkGuess() {
    let guess = [...document.getElementById("input-numbers").children].reduce((acc, n) => acc + (String(n.value) || '-'), '');

    const hintsElements = [...document.getElementById("hints").getElementsByTagName('li')];

    let hintCounter = 0;
    for(let h in _hints) {
        try {
            if(_hints[h].func(guess)) {
                hintsElements[h].classList.remove("wrong");
                hintsElements[h].classList.add("correct");
                hintCounter++;
            }
            else {
                hintsElements[h].classList.add("wrong");
                hintsElements[h].classList.remove("correct");
            }
        }
        catch {
            hintsElements[h].classList.add("wrong");
            hintsElements[h].classList.remove("correct");
        }
    }

    if(hintCounter == _hints.length) {
        document.getElementById("input-numbers").classList.add("correct");
        document.getElementById("guess-btn").setAttribute("disabled", true);
    }
}

bindNumberValidator();
generateNewNumber();
generateHints();