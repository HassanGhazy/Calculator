const keys = document.querySelector("#keys");
const display = document.querySelector("#display");
const currency = document.querySelector("#currency");
let res = 0;

function isOperator(sign) {
    return sign === '*' || sign === '+' || sign === '-' || sign === '/' || sign === 'mod' || sign === '=';
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

function isCurrencySentence(curr) {
    return curr === 'Shekels converted to Dollars' || curr === 'Dollars converted to Shekels' || curr === 'Shekels converted to Euros' || curr === 'Euros converted to Shekels'
}

function clearNoSpace(arr) {
    return arr.filter(e => e !== '');
}



keys.addEventListener('click', e => {

    const clickedKey = e.target.textContent //value clicked
    let equation = display.textContent // full equation
    let lastClicked = equation.substring(equation.length - 2, equation.length - 1);
    let lastClickedMod = equation.substring(equation.length - 4, equation.length - 1);


    if (e.target.matches('button')) {
        if (equation.includes('=') && clickedKey !== '=') {
            display.textContent = '';
        }

        if (equation === '0') {
            display.textContent = clickedKey; // to remove the zero when add a number
        } else if (isOperator(clickedKey)) {
            display.textContent += " " + clickedKey + " ";

        } else if (isCurrencySentence(equation)) {
            display.textContent = clickedKey // to remove the sentence curr when add a number

        } else {
            display.textContent += clickedKey; // to add number 
        }

        if (equation === '0' && clickedKey === '0') { // don't repeat the zero
            display.textContent = '0';
        }
        if (clickedKey === 'C') { // clear the result and the display
            display.textContent = '0';
            result.textContent = '0';
        }

        if (clickedKey === 'CE') {
            if ((isOperator(lastClicked) || lastClicked === 'd') && lastClicked !== '=') { // don't clear the operand
                display.textContent = equation;

            } else if (equation === '0') { // to not add CE in display and to not remove the zero
                display.textContent = '0';

            } else if (equation.includes('=')) { // doing like c (clear)
                display.textContent = '0';

            } else if (isCurrencySentence(equation)) { // to remove the currency converter
                display.textContent = '0';
            } else if (equation.length == 1) { // don't clear the zero
                display.textContent = '0';
            } else if (display.textContent !== '0') { // clear the last number
                display.textContent = display.textContent.substring(0, display.textContent.length - 3); //the length is 3 (2 for CE and 1 for the last number)
            }
        }

        if (equation.substring(equation.length - 2, equation.length) === '.' && clickedKey === '.') {
            display.textContent = equation.substring(0, display.textContent.length - 1);
        }

        if (lastClicked === '=' && clickedKey === '=') {
            display.textContent = equation.substring(0, display.textContent.length - 2);
        }

        if (equation === '0' && isOperator(clickedKey)) { // if you start with operand
            display.textContent = '0 ' + clickedKey + ' ';
        }

        if ((isOperator(lastClicked) || isOperator(lastClickedMod)) && isOperator(clickedKey)) { // to prevent repaeat last operator
            // i need to pass convert mod to + - / *  and pass convert + - * / to mod 
            if (clickedKey !== 'mod' && !equation.includes('mo' + lastClicked)) { // if repeat + - * /
                display.textContent = display.textContent.substring(0, display.textContent.length - 5) + clickedKey + ' ';

            } else if (clickedKey === 'mod' && !equation.includes('mo' + lastClicked)) { // to change + - * / to mod
                display.textContent = display.textContent.substring(0, display.textContent.length - 7) + clickedKey + ' ';

                // you can mix the bottom condition with the above condition 
                //but im my opinion like this will be more clear

            } else if (clickedKey !== 'mod') { // to change mod to + - * /
                display.textContent = display.textContent.substring(0, display.textContent.length - 7) + clickedKey + ' ';

            } else { // if repeat mod
                display.textContent = display.textContent.substring(0, display.textContent.length - 9) + clickedKey + ' ';

            }
        }

        if (clickedKey === '=') {

            let array = equation.split(' ');

            for (let i = 0; i < array.length; i++) {
                if (array[i] === '*') {
                    res = array[i - 1] * array[i + 1];
                    array[i - 1] = '';
                    array[i + 1] = '';
                    array[i] = res;
                    array = clearNoSpace(array);
                    i--;

                } else if (array[i] === '/') {
                    res = array[i - 1] / array[i + 1];
                    array[i - 1] = '';
                    array[i + 1] = '';
                    array[i] = res;
                    array = clearNoSpace(array);
                    i--;
                } else if (array[i] === 'mod') {
                    res = array[i - 1] % array[i + 1];
                    array[i - 1] = '';
                    array[i + 1] = '';
                    array[i] = res;
                    array = clearNoSpace(array);
                    i--;
                }

            }
            for (let i = 0; i < array.length; i++) {
                if (array[i] === '+') {
                    res = parseFloat(array[i - 1]) + parseFloat(array[i + 1]);
                    array[i - 1] = '';
                    array[i + 1] = '';
                    array[i] = res;
                    array = clearNoSpace(array);
                    i--;

                } else if (array[i] === '-') {
                    res = parseFloat(array[i - 1]) - parseFloat(array[i + 1]);
                    array[i - 1] = '';
                    array[i + 1] = '';
                    array[i] = res;
                    array = clearNoSpace(array);
                    i--;
                }
            }
            let checkCorrection = equation.slice(equation.lastIndexOf(' '), equation.length);
            if (isNumber(equation)) {
                result.textContent = equation;
            } else if (isNumber(checkCorrection)) {
                result.textContent = res;
                finalResult = res;
            } else {
                result.textContent = 'Syntax error';
            }
        }
        if (isOperator(clickedKey) && equation.includes('=') && equation !== 'Syntax error') {
            if (result.textContent !== 'Syntax error' && result.textContent !== 'NaN') {
                display.textContent = result.textContent + ' ' + clickedKey + ' ';
            } else {
                display.textContent = '0 ' + clickedKey + ' ';

            }
        }
        let exactCurrency = display.textContent.substring(0, display.textContent.length - 2).trim(); // to get the sentence without the operand

        if (isCurrencySentence(exactCurrency) && isOperator(clickedKey)) {
            display.textContent = '0 ' + clickedKey + ' ';
        }

    }
})

currency.addEventListener('click', e => {
    const clickedCurr = e.target.textContent;
    if (e.target.matches('button')) {

        if (isNumber(display.textContent)) {
            res = display.textContent;
        }
        if (res >= 0) {
            if (clickedCurr === 'Shekels into Dollars') {
                display.textContent = 'Shekels converted to Dollars';
                result.textContent = res / 3.26;
            }
            if (clickedCurr === 'Dollars into Shekels') {
                display.textContent = 'Dollars converted to Shekels';
                result.textContent = res * 3.26;
            }
            if (clickedCurr === 'Shekels into Euros') {
                display.textContent = 'Shekels converted to Euros';
                result.textContent = res / 3.97;
            }
            if (clickedCurr === 'Euros into Shekels') {
                display.textContent = 'Euros converted to Shekels';
                result.textContent = res * 3.97;
            }
        } else {
            result.textContent = 'Syntax error';
        }
    }
})