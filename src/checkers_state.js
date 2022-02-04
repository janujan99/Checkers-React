"use strict";
exports.__esModule = true;
var Turn;
(function (Turn) {
    Turn[Turn["RedTurn"] = 1] = "RedTurn";
    Turn[Turn["BlackTurn"] = 2] = "BlackTurn";
})(Turn || (Turn = {}));
var Colour;
(function (Colour) {
    Colour[Colour["Red"] = 1] = "Red";
    Colour[Colour["Black"] = 2] = "Black";
})(Colour || (Colour = {}));
function isValidCoordinate(position) {
    return position.x < 8 && position.x >= 0 && position.y < 8 && position.y >= 0;
}
function getNonCaptureMoves(piece, board) {
    var moves;
    var directionFactor = piece.colour === Colour.Red ? -1 : 1;
    //get possible move locations
    if (piece.hasPromoted)
        moves = [
            { x: piece.position.x + 1, y: piece.position.y + 1 },
            { x: piece.position.x - 1, y: piece.position.y + 1 },
            { x: piece.position.x + 1, y: piece.position.y - 1 },
            { x: piece.position.x - 1, y: piece.position.y - 1 },
        ];
    else
        moves = [
            { x: piece.position.x + 1, y: piece.position.y + directionFactor },
            { x: piece.position.x - 1, y: piece.position.y + directionFactor },
        ];
    var filteredMoves = [];
    for (var i = 0; i < moves.length; i++) {
        if (isValidCoordinate(moves[i]) &&
            board.grid[moves[i].y][moves[i].x] === null)
            filteredMoves.push(moves[i]);
    }
    return filteredMoves;
}
function getCaptureMoves(piece, board) {
    var moves;
    var directionFactor = piece.colour === Colour.Red ? -1 : 1;
    if (piece.hasPromoted)
        moves = [
            { x: piece.position.x + 2, y: piece.position.y + 2 },
            { x: piece.position.x - 2, y: piece.position.y + 2 },
            { x: piece.position.x + 2, y: piece.position.y - 2 },
            { x: piece.position.x - 2, y: piece.position.y - 2 },
        ];
    else
        moves = [
            { x: piece.position.x + 2, y: piece.position.y + 2 * directionFactor },
            { x: piece.position.x - 2, y: piece.position.y + 2 * directionFactor },
        ];
    var filteredMoves = [];
    for (var i = 0; i < moves.length; i++) {
        if (isValidCoordinate(moves[i]) &&
            board.grid[moves[i].y][moves[i].x] === null &&
            board.grid[(moves[i].y + piece.position.y) / 2][(moves[i].x + piece.position.x) / 2] !== null &&
            board.grid[(moves[i].y + piece.position.y) / 2][(moves[i].x + piece.position.x) / 2].colour !== piece.colour)
            filteredMoves.push(moves[i]);
    }
    return filteredMoves;
}
function makeMove(initial, final, prevState) {
    var tempGrid = [];
    //create deep copy of the board
    for (var i = 0; i < 8; i++) {
        var temp = [];
        for (var j = 0; j < 8; j++) {
            if (prevState.board.grid[i][j] === null)
                temp.push(null);
            else {
                var piece = prevState.board.grid[i][j];
                var checker = {
                    colour: piece.colour,
                    position: { x: piece.position.x, y: piece.position.y },
                    hasPromoted: piece.hasPromoted
                };
                temp.push(checker);
            }
        }
        tempGrid.push(temp);
    }
    var movingChecker = tempGrid[initial.y][initial.x];
    if (movingChecker === null)
        return prevState;
    var newChecker = {
        colour: movingChecker.colour,
        position: final,
        hasPromoted: movingChecker.hasPromoted
    };
    //promote if back rank has been reached
    if ((movingChecker.colour === Colour.Red && final.y === 0) ||
        (movingChecker.colour === Colour.Black && final.y === 7))
        newChecker.hasPromoted = true;
    tempGrid[initial.y][initial.x] = null;
    tempGrid[final.y][final.x] = newChecker;
    if (Math.abs(initial.x - final.x) == 2)
        tempGrid[(initial.y + final.y) / 2][(initial.x + final.x) / 2] = null;
    return {
        board: { grid: tempGrid },
        turn: prevState.turn,
        gameOver: prevState.gameOver
    };
}
function printBoard(board) {
    var _a;
    for (var i = 0; i < 8; i++) {
        var st = "";
        for (var j = 0; j < 8; j++) {
            var ch = void 0;
            if (board.grid[i][j] == null)
                st += " -";
            else {
                var ch_1 = board.grid[i][j].colour === Colour.Red ? "r" : "b";
                if ((_a = board.grid[i][j]) === null || _a === void 0 ? void 0 : _a.hasPromoted)
                    ch_1 = ch_1.toUpperCase();
                st = st + " " + ch_1;
            }
        }
        console.log(st);
    }
}
function newState() {
    var board = {
        grid: [
            [
                null,
                { colour: Colour.Black, position: { x: 1, y: 0 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 3, y: 0 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 5, y: 0 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 7, y: 0 }, hasPromoted: false },
            ],
            [
                { colour: Colour.Black, position: { x: 0, y: 1 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 2, y: 1 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 4, y: 1 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 6, y: 1 }, hasPromoted: false },
                null,
            ],
            [
                null,
                { colour: Colour.Black, position: { x: 1, y: 2 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 3, y: 2 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 5, y: 2 }, hasPromoted: false },
                null,
                { colour: Colour.Black, position: { x: 7, y: 2 }, hasPromoted: false },
            ],
            Array(8).fill(null),
            Array(8).fill(null),
            [
                { colour: Colour.Red, position: { x: 0, y: 5 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 2, y: 5 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 4, y: 5 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 6, y: 5 }, hasPromoted: false },
                null,
            ],
            [
                null,
                { colour: Colour.Red, position: { x: 1, y: 6 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 3, y: 6 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 5, y: 6 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 7, y: 6 }, hasPromoted: false },
            ],
            [
                { colour: Colour.Red, position: { x: 0, y: 7 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 2, y: 7 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 4, y: 7 }, hasPromoted: false },
                null,
                { colour: Colour.Red, position: { x: 6, y: 7 }, hasPromoted: false },
                null,
            ],
        ]
    };
    return { board: board, turn: Turn.RedTurn, gameOver: false };
}
function main() {
    var state = newState();
    var prompt_sync = require("prompt-sync")();
    while (!state.gameOver) {
        printBoard(state.board);
        var validPiece = false;
        var inputX = -1;
        var inputY = -1;
        while (!validPiece) {
            inputX = parseInt(prompt_sync("Enter column of piece: "));
            inputY = parseInt(prompt_sync("Enter row of piece: "));
            if (isValidCoordinate({ x: inputX, y: inputY }) &&
                state.board.grid[inputY][inputX] !== null &&
                ((state.board.grid[inputY][inputX].colour === Colour.Red &&
                    state.turn === Turn.RedTurn) ||
                    (state.board.grid[inputY][inputX].colour === Colour.Black &&
                        state.turn === Turn.BlackTurn)) &&
                (getCaptureMoves(state.board.grid[inputY][inputX], state.board)
                    .length > 0 ||
                    getNonCaptureMoves(state.board.grid[inputY][inputX], state.board)
                        .length > 0))
                validPiece = true;
            else
                console.log("Invalid piece location. Try again");
        }
        var captureMoves = getCaptureMoves(state.board.grid[inputY][inputX], state.board);
        var nonCaptureMoves = getNonCaptureMoves(state.board.grid[inputY][inputX], state.board);
        var allMoves = captureMoves.concat(nonCaptureMoves);
        var validMove = false;
        var moveIndex = -1;
        console.log(allMoves);
        while (!validMove) {
            moveIndex = parseInt(prompt_sync("Enter index in moves array: "));
            if (moveIndex >= 0 && moveIndex < allMoves.length)
                validMove = true;
            else
                console.log("Invalid move index. Try again.");
        }
        // assume state is immutable and reassign state as needed
        var newState_1 = makeMove({ x: inputX, y: inputY }, { x: allMoves[moveIndex].x, y: allMoves[moveIndex].y }, state);
        state = newState_1;
        var keepMoving = false;
        var pieceLocation = allMoves[moveIndex];
        if (captureMoves.includes(pieceLocation))
            keepMoving = true;
        while (keepMoving &&
            getCaptureMoves(state.board.grid[pieceLocation.y][pieceLocation.x], state.board).length > 0) {
            printBoard(state.board);
            captureMoves = getCaptureMoves(state.board.grid[pieceLocation.y][pieceLocation.x], state.board);
            var validCapture = false;
            var captureIndex = -1;
            console.log(captureMoves);
            while (!validCapture) {
                captureIndex = parseInt(prompt_sync("Enter index in capture moves array: "));
                if (captureIndex >= 0 && captureIndex < captureMoves.length)
                    validCapture = true;
                else
                    console.log("Invalid move index. Try again.");
            }
            newState_1 = makeMove({ x: pieceLocation.x, y: pieceLocation.y }, { x: captureMoves[captureIndex].x, y: captureMoves[captureIndex].y }, state);
            state = newState_1;
            pieceLocation = captureMoves[captureIndex];
        }
        var nextTurn = state.turn === Turn.RedTurn ? Turn.BlackTurn : Turn.RedTurn;
        newState_1 = { board: state.board, turn: nextTurn, gameOver: state.gameOver };
        state = newState_1;
    }
}
main();
