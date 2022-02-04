export {};
interface CheckersState {
  board: Board;
  turn: Turn;
  gameOver: boolean;
}

interface Position {
  x: number;
  y: number;
}

enum Turn {
  RedTurn = 1,
  BlackTurn = 2,
}

enum Colour {
  Red = 1,
  Black = 2,
}

interface Checker {
  colour: Colour;
  position: Position;
  hasPromoted: boolean;
}

interface Board {
  grid: (Checker | null)[][];
}

function isValidCoordinate(position: Position): boolean {
  return position.x < 8 && position.x >= 0 && position.y < 8 && position.y >= 0;
}

function getNonCaptureMoves(piece: Checker, board: Board): Position[] {
  let moves: Position[];
  let directionFactor: number = piece.colour === Colour.Red ? -1 : 1;

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

  let filteredMoves: Position[] = [];

  for (let i = 0; i < moves.length; i++) {
    if (
      isValidCoordinate(moves[i]) &&
      board.grid[moves[i].y][moves[i].x] === null
    )
      filteredMoves.push(moves[i]);
  }

  return filteredMoves;
}

function getCaptureMoves(piece: Checker, board: Board): Position[] {
  let moves: Position[];
  let directionFactor: number = piece.colour === Colour.Red ? -1 : 1;

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

  let filteredMoves: Position[] = [];

  for (let i = 0; i < moves.length; i++) {
    if (
      isValidCoordinate(moves[i]) &&
      board.grid[moves[i].y][moves[i].x] === null &&
      board.grid[(moves[i].y + piece.position.y) / 2][
        (moves[i].x + piece.position.x) / 2
      ] !== null &&
      board.grid[(moves[i].y + piece.position.y) / 2][
        (moves[i].x + piece.position.x) / 2
      ]!.colour !== piece.colour
    )
      filteredMoves.push(moves[i]);
  }

  return filteredMoves;
}

function makeMove(
  initial: Position,
  final: Position,
  prevState: CheckersState
): CheckersState {
  let tempGrid: (Checker | null)[][] = [];

  //create deep copy of the board
  for (let i = 0; i < 8; i++) {
    let temp: (Checker | null)[] = [];
    for (let j = 0; j < 8; j++) {
      if (prevState.board.grid[i][j] === null) temp.push(null);
      else {
        let piece = prevState.board.grid[i][j];
        let checker: Checker = {
          colour: piece!.colour,
          position: { x: piece!.position.x, y: piece!.position.y },
          hasPromoted: piece!.hasPromoted,
        };
        temp.push(checker);
      }
    }
    tempGrid.push(temp);
  }

  let movingChecker: Checker | null = tempGrid[initial.y][initial.x];

  if (movingChecker === null) return prevState;
  let newChecker: Checker = {
    colour: movingChecker.colour,
    position: final,
    hasPromoted: movingChecker.hasPromoted,
  };

  //promote if back rank has been reached
  if (
    (movingChecker.colour === Colour.Red && final.y === 0) ||
    (movingChecker.colour === Colour.Black && final.y === 7)
  )
    newChecker.hasPromoted = true;

  tempGrid[initial.y][initial.x] = null;
  tempGrid[final.y][final.x] = newChecker;

  if (Math.abs(initial.x - final.x) == 2)
    tempGrid[(initial.y + final.y) / 2][(initial.x + final.x) / 2] = null;

  return {
    board: { grid: tempGrid },
    turn: prevState.turn,
    gameOver: prevState.gameOver,
  };
}

function printBoard(board: Board) {
  for (let i = 0; i < 8; i++) {
    let st: string = "";

    for (let j = 0; j < 8; j++) {
      let ch: string;
      if (board.grid[i][j] == null) st += " -";
      else {
        let ch: string = board.grid[i][j]!.colour === Colour.Red ? "r" : "b";
        if (board.grid[i][j]?.hasPromoted) ch = ch.toUpperCase();
        st = st + " " + ch;
      }
    }
    console.log(st);
  }
}

function newState(): CheckersState {
  let board: Board = {
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
    ],
  };
  return { board: board, turn: Turn.RedTurn, gameOver: false };
}

function gameOver(gameState: CheckersState): boolean {
  let colour: Colour =
    gameState.turn === Turn.RedTurn ? Colour.Black : Colour.Red;
  // check if the other player has any moves left to make or has any pieces left
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square: Checker | null = gameState.board.grid[i][j];
      if (
        square !== null &&
        square!.colour === colour &&
        getCaptureMoves(square!, gameState.board).concat(
          getNonCaptureMoves(square!, gameState.board)
        ).length > 0
      )
        return true;
    }
  }
  return false;
}

function main() {
  let state: CheckersState = newState();
  var prompt_sync = require("prompt-sync")();

  while (!state.gameOver) {
    printBoard(state.board);
    console.log(state.turn === Turn.RedTurn ? "Red's turn" : "Black's Turn");
    let validPiece: boolean = false;
    let inputX: number = -1;
    let inputY: number = -1;

    while (!validPiece) {
      inputX = parseInt(prompt_sync("Enter column of piece: "));
      inputY = parseInt(prompt_sync("Enter row of piece: "));
      if (
        isValidCoordinate({ x: inputX, y: inputY }) &&
        state.board.grid[inputY][inputX] !== null &&
        ((state.board.grid[inputY][inputX]!.colour === Colour.Red &&
          state.turn === Turn.RedTurn) ||
          (state.board.grid[inputY][inputX]!.colour === Colour.Black &&
            state.turn === Turn.BlackTurn)) &&
        (getCaptureMoves(state.board.grid[inputY][inputX]!, state.board)
          .length > 0 ||
          getNonCaptureMoves(state.board.grid[inputY][inputX]!, state.board)
            .length > 0)
      )
        validPiece = true;
      else console.log("Invalid piece location. Try again");
    }

    let captureMoves: Position[] = getCaptureMoves(
      state.board.grid[inputY][inputX]!,
      state.board
    );
    let nonCaptureMoves: Position[] = getNonCaptureMoves(
      state.board.grid[inputY][inputX]!,
      state.board
    );
    let allMoves: Position[] = captureMoves.concat(nonCaptureMoves);
    let validMove: boolean = false;
    let moveIndex: number = -1;

    console.log(allMoves);

    while (!validMove) {
      moveIndex = parseInt(prompt_sync("Enter index in moves array: ")!);
      if (moveIndex >= 0 && moveIndex < allMoves.length) validMove = true;
      else console.log("Invalid move index. Try again.");
    }

    // assume state is immutable and reassign state as needed
    let newState = makeMove(
      { x: inputX, y: inputY },
      { x: allMoves[moveIndex].x, y: allMoves[moveIndex].y },
      state
    );

    state = newState;

    let keepMoving: boolean = false;
    let pieceLocation: Position = allMoves[moveIndex];

    if (captureMoves.includes(pieceLocation)) keepMoving = true;

    while (
      keepMoving &&
      getCaptureMoves(
        state.board.grid[pieceLocation.y][pieceLocation.x]!,
        state.board
      ).length > 0
    ) {
      printBoard(state.board);
      captureMoves = getCaptureMoves(
        state.board.grid[pieceLocation.y][pieceLocation.x]!,
        state.board
      );
      let validCapture: boolean = false;
      let captureIndex: number = -1;

      console.log(captureMoves);
      while (!validCapture) {
        captureIndex = parseInt(
          prompt_sync("Enter index in capture moves array: ")
        );
        if (captureIndex >= 0 && captureIndex < captureMoves.length)
          validCapture = true;
        else console.log("Invalid move index. Try again.");
      }

      newState = makeMove(
        { x: pieceLocation.x, y: pieceLocation.y },
        { x: captureMoves[captureIndex].x, y: captureMoves[captureIndex].y },
        state
      );
      state = newState;

      pieceLocation = captureMoves[captureIndex];
    }

    let gameStatus: boolean = gameOver(state);

    let nextTurn: Turn =
      state.turn === Turn.RedTurn ? Turn.BlackTurn : Turn.RedTurn;

    newState = { board: state.board, turn: nextTurn, gameOver: gameStatus };
    state = newState;
  }

  if (state.turn === Turn.RedTurn) console.log("Black wins! ");
  else console.log("Red wins! ");
}

main();
