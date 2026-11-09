let board = [];
let gameOver = false;
let computerThinking = false;
let computerTimer;

let boardElement = document.getElementById("board");
let messageElement = document.getElementById("message");
let restartButton = document.getElementById("restartButton");

// starts / restarts connect4 game
function startGame() {
    clearTimeout(computerTimer);
    board = [];

    for (let row = 0; row < 6; row++) {
        let newRow = [];

        for (let column = 0; column < 7; column++) {
            newRow.push(0);
        }

        board.push(newRow);
    }

    gameOver = false;
    computerThinking = false;
    messageElement.textContent = "";
    drawBoard();
}

// allows array to be clicked/interacted with
function drawBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < 6; row++) {
        for (let column = 0; column < 7; column++) {
            let cell = document.createElement("button");
            cell.className = "cell";
            cell.setAttribute("data-column", column);

            if (board[row][column] === 1) {
                cell.classList.add("human");
            } else if (board[row][column] === 2) {
                cell.classList.add("computer");
            }

            cell.addEventListener("click", playerMove);
            boardElement.appendChild(cell);
        }
    }
}

// piece drops down column, -1 means column full
function dropPiece(column, player) {
    for (let row = 5; row >= 0; row--) {
        if (board[row][column] === 0) {
            board[row][column] = player;
            return row;
        }
    }

    return -1;
}

// check player movement, check for win or draw, end turn (computer thinking)
function playerMove(event) {
    if (gameOver || computerThinking) {
        return;
    }

    let column = Number(event.currentTarget.getAttribute("data-column"));
    let row = dropPiece(column, 1);

    if (row === -1) {
        return;
    }

    drawBoard();

    if (checkWin(1)) {
        messageElement.textContent = "You win";
        gameOver = true;
        return;
    }

    if (boardFull()) {
        messageElement.textContent = "Draw";
        gameOver = true;
        return;
    }

    computerThinking = true;
    computerTimer = setTimeout(computerMove, 400);
}

// computer equivalent
function computerMove() {
    let column = chooseComputerColumn();
    dropPiece(column, 2);
    drawBoard();

    if (checkWin(2)) {
        messageElement.textContent = "Computer wins";
        gameOver = true;
    } else if (boardFull()) {
        messageElement.textContent = "Draw";
        gameOver = true;
    }

    computerThinking = false;
}

// computer logic
function chooseComputerColumn() {

    // if comp finds winning move, take it 
    for (let column = 0; column < 7; column++) {
        if (board[0][column] === 0) {
            let row = dropPiece(column, 2);
            let winningMove = checkWin(2);
            board[row][column] = 0;

            if (winningMove) {
                return column;
            }
        }
    }

    // if comp finds winning move for user, block it
    for (let column = 0; column < 7; column++) {
        if (board[0][column] === 0) {
            let row = dropPiece(column, 1);
            let winningMove = checkWin(1);
            board[row][column] = 0;

            if (winningMove) {
                return column;
            }
        }
    }

    // otherwise, random column 
    let openColumns = [];

    for (let column = 0; column < 7; column++) {
        if (board[0][column] === 0) {
            openColumns.push(column);
        }
    }

    let randomIndex = Math.floor(Math.random() * openColumns.length);
    return openColumns[randomIndex];
}

// func to checkwin, called previously
function checkWin(player) {

    // horizontal
    for (let row = 0; row < 6; row++) {
        for (let column = 0; column < 4; column++) {
            if (board[row][column] === player &&
                board[row][column + 1] === player &&
                board[row][column + 2] === player &&
                board[row][column + 3] === player) {
                return true;
            }
        }
    }

    // vertical
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 7; column++) {
            if (board[row][column] === player &&
                board[row + 1][column] === player &&
                board[row + 2][column] === player &&
                board[row + 3][column] === player) {
                return true;
            }
        }
    }

    // diagonal down right
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 4; column++) {
            if (board[row][column] === player &&
                board[row + 1][column + 1] === player &&
                board[row + 2][column + 2] === player &&
                board[row + 3][column + 3] === player) {
                return true;
            }
        }
    }

    // diagonal down left
    for (let row = 0; row < 3; row++) {
        for (let column = 3; column < 7; column++) {
            if (board[row][column] === player &&
                board[row + 1][column - 1] === player &&
                board[row + 2][column - 2] === player &&
                board[row + 3][column - 3] === player) {
                return true;
            }
        }
    }

    return false;
}

// check for a full board
function boardFull() {
    for (let column = 0; column < 7; column++) {
        if (board[0][column] === 0) {
            return false;
        }
    }

    return true;
}

// restart button
restartButton.addEventListener("click", startGame);
startGame();
