var roomInfo, socket


// connection details
let connectionNumber = 0 // 0, 1, 2 (spec)
let playerNumber = -1

let randomRoomNumber = 0//Math.floor(Math.random() * 10000)


function startGame() {
    game.restart()
    if (!timeless)
        startTimers()
}

function connectToRoom(roomInfo = { "roomNumber": randomRoomNumber, "quickstart": false, timeControl: [60, 5] }) {
    roomInfo = roomInfo
    console.log(roomInfo)
    timeless = false
    socket = new WebSocket(
        `wss://free.blr2.piesocket.com/v3/presence-${roomInfo.roomNumber}?api_key=OvCz2lDHgmuHuSURiXSoPfd6nzyvg1RkRqeCBLSg`
    );

    socket.onopen = () => {
        console.log("Socket opened")
    }


    socket.onmessage = (event) => {
        data = JSON.parse(event.data)
        console.log(data);
        switch (data.event) {
            // This is the case where you join the room
            case 'system:member_list':
                // Number of members in the room
                connectionNumber = data.data.members.length - 1
                // If you are the first player to join, you get a playerNumber!
                if (connectionNumber == 0)
                    playerNumber = Math.floor(Math.random() * 2)
                break;
            case 'system:member_joined':

                // If the second player joined, start the game
                if (data.data.members.length == 2) {
                    // TODO have this reset your game if its the second person
                    socket.send(JSON.stringify({
                        "event": "game:init",
                        "data": {
                            "playerNumber": 1 - playerNumber,
                            "quickstart": roomInfo.quickstart,
                            "timeControl": roomInfo.timeControl
                        }
                    }))
                    startGame()
                }
                break;

            case 'game:init':
                // If you arent the host, set your settings
                if (connectionNumber != 0) {
                    playerNumber = data.data.playerNumber
                    roomInfo.quickstart = data.data.quickstart
                    roomInfo.timeControl = data.data.timeControl
                }
                startGame()
                break;
            case 'game:move':
                move = data.data.move
                game.applyMove(move, true)
                break;
            case 'game:undo':
                if (game.wantsToUndo()) {
                    socket.send(JSON.stringify({ "event": "game:undo_accept" }))
                    game.undo()
                } else {
                    socket.send(JSON.stringify({ "event": "game:undo_reject" }))
                }
                break;
            case 'game:undo_accept':
                // this can get out of sync if you intentionally break stuff, 
                // ie send an undo request, then go into the code and unselect undo
                if (game.wantsToUndo)
                    game.undo()
            case 'game:undo_rejected':
                game.wantsToUndo = false
                break;

            case 'game:restart':
                game.restart()

        }
    };
}

// socket.send(JSON.stringify({ "event": "game:move", "data": move }))
d = {
    "event": 3,
    "data": {}
}
/* 

"system:member_list" - on join
"system:member_joined" - on your and other joins
"system:member_left" - on other's leaving ### NO ACTION

"game:move" - on another player taking an move
"game:undo" - other player wishes to undo move
    - send back denied or accepted "game:undo_reject" or "game:undo_accept"
"game:resignation" - other player resigns
"game:resync" - other play responds with a copy of the state, which you set to yours
"game:init" - send setup options (SETUP V QUICKSTART, TIME CONTROL, PLAYER NUMBER)

"chat:send_message" - send a message to chat*/