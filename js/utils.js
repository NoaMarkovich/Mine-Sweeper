// renders a cell in a table.
//location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

//return a random number between 2 numbers
function getRandomInt(min, max) {
    return Math.trunc(Math.random() * (max - min)) + min;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

//gives a random color in hex code
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// return an arry of empty cells inside a board
function getEmptyCell(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if (currCell === EMPTY) {
                var emptyCellPos = { i, j };
                emptyCells.push(emptyCellPos);
            }
        }
    }
    var randomIdx = getRandomInt(0, emptyCells.length);
    var emptyCell = emptyCells[randomIdx];
    return emptyCell;
}
// var gTimerInterval;
// var gTimer;
// function setTimer() {
//     var startTime = Date.now();
//     gTimer = () => {
//         var elTimer = document.querySelector('.timer');
//         elTimer.innerText = ((Date.now() - startTime) / 1000).toFixed(2);
//     }
// }

var min = 0;
var secEl = document.querySelector('.second');
var minEl = document.querySelector('.minute');
var sec = 0;
function timer() {
  sec++;
  if (sec === 60) {
    sec = 0;
    min++;
  }
  secEl.innerHTML = sec;
  minEl.innerHTML = min;
}