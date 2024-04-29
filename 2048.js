
var board;
var temp_board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    temp_board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);

        }
    }

    setTwo();
    setTwo();
}

function resetGame() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            board[r][c] = 0;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 0);
        }
    }
    setTwo();
    setTwo();
    score = 0;
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            let rand = Math.floor(Math.random() * 10);
            if (rand == 0) {
                board[r][c] = 4;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.innerText = "4";
                tile.classList.add("x4");
            }
            else {
                board[r][c] = 2;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.innerText = "2";
                tile.classList.add("x2");
            }
            found = true;
        }
    }
}

function checklose() {
    if (hasEmptyTile()) {
        return false;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (r >= 1 && board[r-1][c] == board[r][c]) {
                return false;
            }
            if (r <= 2 && board[r+1][c] == board[r][c]) {
                return false;
            }
            if (c >= 1 && board[r][c-1] == board[r][c]) {
                return false;
            }
            if (c <= 2 && board[r][c+1] == board[r][c]) {
                return false;
            }
        }
    }
    return true;
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        }
        else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        if(!slideLeft()) {
            setTwo();
            console.log(checklose());
            if (checklose()) {
                resetGame();
            }
        }
    }
    else if (e.code == "ArrowRight") {
        if(!slideRight()) {
            setTwo();
            if (checklose()) {
                resetGame();
            }
        }
    }
    else if (e.code == "ArrowUp") {
        if(!slideUp()) {
            setTwo();
            if (checklose()) {
                resetGame();
            }
        }
    }
    else if (e.code == "ArrowDown") {
        if(!slideDown()) {
            setTwo();
            if (checklose()) {
                resetGame();
            }
        }
    }
    document.getElementById("score").innerText = score;
})

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function boardcmp() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++){
            if (board[i][j] != temp_board[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function boardset() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++){
            temp_board[i][j] = board[i][j];
        }
    }
}

function slideLeft() {
    boardset();

    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return boardcmp();
}

function slideRight() {
    boardset();

    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return boardcmp();
}

function slideUp() {
    boardset();

    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return boardcmp();
}

function slideDown() {
    boardset();

    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return boardcmp();
}