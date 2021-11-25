var MINE = '💣';
var EMPTY = '';
var FLAG = '🚩';

var gRows = 4;
var gCols = 4;
var gBoard;
var gLives;
var gTimerInterval;
gLevel = {
    SIZE: 4,
    MINES: 2
};

gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    gLives = 3;
    var livesEl = document.getElementById('lives');
    livesEl.innerText = `❤ x ${gLives}`;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gLevel.SIZE);
    var restartBtn = document.querySelector('.smiley');
    restartBtn.innerText = '🙂';
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {
                i: i,
                j: j,
                type: EMPTY,
                isShown: false,
                isMine: false,
                isMarked: false,
                isClicked: false,

            }
            board[i][j] = cell;
        }
    }
    return board;
}

function addMines(cell) {
    var maxMines = gLevel.MINES;
    var levelSize = gLevel.SIZE - 1;
    for (var i = 0; i < maxMines; i++) {
        var cellInputI = getRandomIntInclusive(0, levelSize);
        var cellInputJ = getRandomIntInclusive(0, levelSize);
        if (+cell.dataset.idx === cellInputI && +cell.dataset.jdx === cellInputJ) {
            i--;
        } else {
            gBoard[cellInputI][cellInputJ].isMine = true;
        }
    }
}

function getCellByLocation(location) {
    return document.getElementById(`cell${location.i}-${location.j}`);
}

function addFlag(cell, i, j) {
    if (gBoard[i][j].isMarked === true) {
        cell.innerText = EMPTY;
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;
    } else if (gBoard[i][j].isShown === false || (gBoard[i][j].isMine === true && gBoard[i][j].isShown === true)) {
        cell.innerText = FLAG;
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        if ((gGame.shownCount + gGame.markedCount) === gBoard.length * gBoard.length) {
            alert('You Win!');
        }
    }
}

function getdifficulty(el) {
    var level = el.getAttribute('data-inside')
    if (level === 'beginner') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
    } else if (level === 'medium') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
    } else if (level === 'expert') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
    }
    init();
}

function renderBoard(size) {
    var strHTML = '';
    for (var i = 0; i < size; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < size; j++) {
            var idx = `${i}`;
            var jdx = `${j}`;
            strHTML += `<td id="cell${idx}-${jdx}" class="cell" oncontextmenu="addFlag(this, ${i}, ${j}); return false" onclick="cellClicked(this)" data-ismine = "${gBoard[i][j].isMine}" data-idx = ${idx} data-jdx = ${jdx}>
            </td > `;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(cell) {
    if (gGame.shownCount === 0) {
        addMines(cell);
        renderBoard(gLevel.SIZE);
        gTimerInterval = setInterval(timer, 1000);
        cell = getCellByLocation({ i: cell.dataset.idx, j: cell.dataset.jdx });
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isMarked === true) {
                    var flagCell = getCellByLocation({ i, j });
                    flagCell.innerHTML = FLAG;
                }
            }
        }
    }
    if (cell.isShown) {
        return;
    }
    var isMine = cell.dataset.ismine;
    var idx = cell.dataset.idx;
    var jdx = cell.dataset.jdx;

    cell.classList.add('selected');
    if (isMine === 'true') {
        if (gLives > 1) {
            decreaseLives();
            cell.classList.add('mine');
            cell.innerText = MINE;
            cell.isShown = true;
        } else {
            gameOver();
            decreaseLives();
        }
    }  else {
        var mines = setMinesNegsCount(gBoard, idx, jdx);
        cell.innerText = mines;
        if (mines === 0) {
            idx = +idx;
            jdx = +jdx;
            for (var i = idx - 1; i <= idx + 1; i++) {
                if (i < 0 || i > gBoard.length - 1) continue;
                for (var j = jdx - 1; j <= jdx + 1; j++) {
                    if (j < 0 || j > gBoard[0].length - 1) continue;
                    if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) {
                        var pos = { i: i, j: j };
                        var currCell = getCellByLocation(pos);
                        currCell.innerText = setMinesNegsCount(gBoard, i, j);
                        gBoard[i][j].isShown = true;
                        currCell.classList.add("selected");
                        gGame.shownCount++;
                    }
                }
            }
        } else {
            cell.innerText = setMinesNegsCount(gBoard, idx, jdx);
            gGame.shownCount++;
            gBoard[idx][jdx].isShown = true;
            gBoard[idx][jdx].isClicked = true;
        }
        if ((gGame.shownCount + gGame.markedCount) === gBoard.length * gBoard.length) {
            alert('You Win!');
        }
    }
}

function decreaseLives() {
    gLives--;
    var livesEl = document.getElementById('lives');
    livesEl.innerText = `❤ x ${gLives}`;
}

function setMinesNegsCount(mat, idx, jdx) {
    var counter = 0;
    idx = +idx;
    jdx = +jdx;
    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === idx && j === jdx) continue;
            var cell = mat[i][j];
            if (cell.isMine === true) {
                counter++;
            }
        }
    }
    return counter;
}

function gameOver() {
    var restartBtn = document.querySelector('.smiley');
    restartBtn.innerText = '😨';
    clearInterval(gTimerInterval);
    var cells = document.querySelectorAll('.cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].onclick = false;
        if (cells[i].dataset.ismine === 'true') {
            cells[i].classList.add('mine');
            cells[i].innerText = MINE;
        }
    }
}