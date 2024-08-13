function createNewRow(rowNumber) {
    var container = movehistorybox

    // Create a new row div
    const row = document.createElement('div');
    row.classList.add("movehistoryrow")

    // Create the first div
    const turnNumberDiv = document.createElement('div');
    turnNumberDiv.classList.add("turnnumber")
    turnNumberDiv.textContent = rowNumber;

    // Create the second div
    const playerZeroMovesDiv = document.createElement('div')
    playerZeroMovesDiv.classList.add("playermoves")

    // Create the third div
    const playerOneMovesDiv = document.createElement('div')
    playerOneMovesDiv.classList.add("playermoves")

    // Append the divs to the row
    row.appendChild(turnNumberDiv);
    row.appendChild(playerZeroMovesDiv);
    row.appendChild(playerOneMovesDiv);

    // Append the row to the container
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
    return [row, playerZeroMovesDiv, playerOneMovesDiv]
}

function createMoveHistory(movesWithSeparators) {
    movehistorybox.innerHTML = '';
    var isPlayerZerosTurn = true
    var currentZeroDiv, currentOneDiv
    var currentRowNumber = 0
    for (move of movesWithSeparators) {

        if (move.length == 0 && isPlayerZerosTurn) {
            isPlayerZerosTurn = false
            currentRowNumber += 1
            res = createNewRow(currentRowNumber)
            currentZeroDiv = res[1]
            currentOneDiv = res[2]

        } else if (move.length == 0) {
            isPlayerZerosTurn = true
        } else if (!isPlayerZerosTurn) {
            currentZeroDiv.innerHTML += prettyPrintMove(move) + "<br>"
        } else if (isPlayerZerosTurn) {
            currentOneDiv.innerHTML += prettyPrintMove(move) + "<br>"
        }
    }
}

function clearMoveHistory() {
    movehistorybox.innerHTML = ''
}


function prettyPrintMove(move) {
    var x, y, x1, y1, isAttack
    [x, y, x1, y1, isAttack] = move
    if (isAttack) {
        return `(${x}, ${y}) ✖ (${x1}, ${y1})`
    } else {
        return `(${x}, ${y}) → (${x1}, ${y1})`
    }
}