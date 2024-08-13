room = findGetParameter("room")
playerNumber = findGetParameter("player")
if (playerNumber == null)
    playerNumber = 0
if (room == null)
    room = 0
const socket = new WebSocket(`wss://free.blr2.piesocket.com/v3/presence-${room}?api_key=OvCz2lDHgmuHuSURiXSoPfd6nzyvg1RkRqeCBLSg`);

socket.onopen = () => {
    console.log("Socket opened")
}
socket.onmessage = (event) => {
    res = event.data.split("-")
    //movePawn(...res, false)
    console.log("Message from server:", event.data);
};

socket.onclose = () => {
    console.log("WebSocket connection closed");
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substring(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}