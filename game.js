// Setup gamestate
gameState = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 2, 2, 2, 0, 0, 1, 0],
    [0, 1, 0, 2, 0, 0, 0, 2, 0, 1, 0],
    [0, 1, 0, 2, 0, 3, 0, 2, 0, 1, 0],
    [0, 1, 0, 2, 0, 0, 0, 2, 0, 1, 0],
    [0, 1, 0, 0, 2, 2, 2, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
movingPawn = null
lastMovedPawn = null
mplm = []

currentTurn = 0
currentMove = 0

winner = null

function getEligiblePieces() {
    if (currentTurn != playerNumber)
        return []
    var eligiblePieces = []
    for (var i = 0; i <= 10; i++) {
        for (var j = 0; j <= 10; j++) {
            if (lastMovedPawn != null && (lastMovedPawn[0] == i && lastMovedPawn[1] == j))
                continue
            if (currentTurn == 0) {
                if (gameState[i][j] == 2)
                    eligiblePieces.push([i, j])
                if (currentMove == 0 && gameState[i][j] == 3)
                    eligiblePieces.push([i, j])
            } else if (currentTurn == 1 && gameState[i][j] == 1) {
                eligiblePieces.push([i, j])
            }
        }
    }
    return eligiblePieces
}

function movePawn(x, y, x1, y1, broadcastmove = true) {

    value = gameState[x][y]
    if (gameState[x1][y1] == 3) {
        winner = 1
    } else if (gameState[x][y] == 3 && (x1 == 0 || x1 == 10 || y1 == 0 || y1 == 10)) {
        winner = 0
    }
    gameState[x1][y1] = value
    gameState[x][y] = 0
    currentMove += 1
    if (currentMove == 2) {
        currentMove = 0
        currentTurn = (currentTurn + 1) % 2
    }
    else if ((x != x1 && y != y1) || value == 3) {
        currentTurn = (currentTurn + 1) % 2
        currentMove = 0
    }
    lastMovedPawn = [x1, y1]
    if (broadcastmove)
        socket.send(`${x}-${y}-${x1}-${y1}`)
    // for debugging

    playerNumber = currentTurn

    clearCanvas()
    renderGameState()
}

function getLegalStraightMoves(x, y) {
    if (currentTurn != playerNumber)
        return []
    legalMoves = []
    if (getPieceTeam(x, y) % 2 != currentTurn || (gameState[x][y] == 3 && currentMove == 1)) {
        return legalMoves
    }
    if (lastMovedPawn != null && (lastMovedPawn[0] == x && lastMovedPawn[1] == y))
        return legalMoves

    down = true
    up = true
    left = true
    right = true
    for (var i = 1; i < 10; i++) {
        downy = y - i
        upy = y + i
        leftx = x - i
        rightx = x + i
        if (down && downy >= 0 && gameState[x][downy] == 0) legalMoves.push([x, downy])
        else down = false

        if (up && upy <= 10 && gameState[x][upy] == 0) legalMoves.push([x, upy])
        else up = false

        if (left && leftx >= 0 && gameState[leftx][y] == 0) legalMoves.push([leftx, y])
        else left = false

        if (right && rightx <= 10 && gameState[rightx][y] == 0) legalMoves.push([rightx, y])
        else right = false
    }
    return legalMoves
}

function getLegalAttackMoves(x, y) {
    if (currentTurn != playerNumber)
        return []
    legalAttackMoves = []
    if (getPieceTeam(x, y) % 2 != currentTurn || (gameState[x][y] == 3 && currentMove == 1)) {
        return legalAttackMoves
    }
    if (lastMovedPawn != null && (lastMovedPawn[0] == x && lastMovedPawn[1] == y))
        return legalAttackMoves
    team = getPieceTeam(x, y)
    if (x < 10 && y < 10 && gameState[x + 1][y + 1] != 0 && team != getPieceTeam(x + 1, y + 1)) legalAttackMoves.push([x + 1, y + 1])
    if (x < 10 && y > 0 && gameState[x + 1][y - 1] != 0 && team != getPieceTeam(x + 1, y - 1)) legalAttackMoves.push([x + 1, y - 1])
    if (x > 0 && y < 10 && gameState[x - 1][y + 1] != 0 && team != getPieceTeam(x - 1, y + 1)) legalAttackMoves.push([x - 1, y + 1])
    if (x > 0 && y > 0 && gameState[x - 1][y - 1] != 0 && team != getPieceTeam(x - 1, y - 1)) legalAttackMoves.push([x - 1, y - 1])

    return legalAttackMoves

}

function getPieceTeam(x, y) {
    teamI = gameState[x][y]
    if (teamI == 3) teamI = 2
    return teamI
}