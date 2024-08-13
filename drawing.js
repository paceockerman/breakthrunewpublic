// get canvas
var canvas = document.getElementById("gameBoard");
var ctx = canvas.getContext("2d");

// Setup canvas
function setupCanvasSize() {
    screenDimensions = [window.screen.width, window.screen.height]
    canvasSize = Math.floor(Math.min(...screenDimensions) / 11) * 11 * 0.8
    boxWidth = canvasSize / 11
    canvas.width = canvasSize
    canvas.height = canvasSize
    canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto; border:1px solid #000000;";
    clearCanvas()
    renderGameState()
}
window.onresize = setupCanvasSize
setupCanvasSize()
// its difficult - c

function lineBetween(x0, y0, x1, y1) {
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
}

function drawGrid() {
    for (i = 1; i <= 10; i++) {
        lineBetween(i * boxWidth, 0, i * boxWidth, canvasSize)
        lineBetween(0, i * boxWidth, canvasSize, i * boxWidth)
    }
}

function drawCircle(x, y, color) {
    // takes in x,y grid coordinates, draws a circle in it.
    res = gridToPixel(x, y)
    ctx.beginPath()
    ctx.arc(res[0], res[1], boxWidth / 3, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
}

function drawActiveMarker(x, y) {
    res = gridToPixel(x, y)
    ctx.beginPath()
    ctx.lineWidth = 5;
    ctx.arc(res[0], res[1], boxWidth / 3, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.lineWidth = 1;
}

function drawActiveMarkers(squares) {
    for (var square = 0; square < squares.length; square++) {
        drawActiveMarker(squares[square][0], squares[square][1], 0.2)
    }
}

function highlightSquare(x, y, alpha = 0.2, color = "yellow") {
    res = gridToPixel(x, y)
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.fillRect(res[2], res[3], boxWidth, boxWidth)
    ctx.globalAlpha = 1.0
}

function highlightSquares(squares, color = "yellow") {
    for (var square = 0; square < squares.length; square++) {
        highlightSquare(squares[square][0], squares[square][1], 0.2, color)
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function highlightBorder() {
    for (var i = 0; i < 10; i++) {
        highlightSquare(0, 10 - i, 0.2, "grey") //
        highlightSquare(10, i, 0.2, "grey")
        highlightSquare(i, 0, 0.2, "grey") //
        highlightSquare(10 - i, 10, 0.2, "grey")
    }
}

function renderGameState() {
    highlightBorder()
    drawGrid()
    for (var row = 0; row <= 10; row++) {
        for (var col = 0; col <= 10; col++) {
            if (state.getBoardState()[row][col] == 1) {
                drawCircle(row, col, "silver")
            }
            if (state.getBoardState()[row][col] == 2) {
                drawCircle(row, col, "gold")
            }
            if (state.getBoardState()[row][col] == 4) {
                drawCircle(row, col, "orange")
            }
        }
    }
    drawActiveMarkers(state.getEligiblePieces())
}



function pixelToGrid(x, y) {
    x = Math.floor(x / boxWidth)
    y = Math.floor(y / boxWidth)
    return [x, 10 - y]
}
function gridToPixel(x, y) {
    y = 10 - y
    y = y * boxWidth
    y1 = y + boxWidth
    x = x * boxWidth
    x1 = x + boxWidth
    return [(x + x1) / 2, (y + y1) / 2, x, y]
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return pixelToGrid(x, y)
}
movingPawn = null
mplm = []
winner = null

function onClickActions(x, y) {

    if (movingPawn != null && mplm.findIndex((e) => e[0] == x && e[1] == y) != -1) {
        state.movePiece([movingPawn[0], movingPawn[1], x, y], false)
        movingPawn = null
        mplm = []
        clearCanvas()
        renderGameState()

    }
    else if (state.getBoardState()[x][y] != 0) {

        clearCanvas()


        m1 = state.getLegalStraightMoves(x, y)
        m2 = state.getLegalAttackMoves(x, y)
        highlightSquare(x, y, 0.4)
        highlightSquares(m1)
        highlightSquares(m2, "red")
        movingPawn = [x, y]
        mplm = m1.concat(m2)
        renderGameState()
    } else {
        movingPawn = null
        mplm = []
        clearCanvas()
        renderGameState()
    }

    if (winner != null) {
        alert("Player " + (winner + 1) + " is the winner!")
    }
}

canvas.addEventListener('mousedown', function (e) {
    [x, y] = getCursorPosition(canvas, e)
    onClickActions(x, y)
})
