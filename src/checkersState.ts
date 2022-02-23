export interface CheckersState {
  board: Board;
  turn: Turn;
  turnType: TurnType;
  gameOver: boolean;
  currentPieceLocation: Position;
}

export interface Position {
  x: number;
  y: number;
}

export enum Turn {
  RedTurn = 1,
  BlackTurn = 2,
}

export enum TurnType {
  Continue = 1,
  Next = 2,
}

export enum Colour {
  Red = 1,
  Black = 2,
}

export interface Checker {
  colour: Colour;
  position: Position;
  hasPromoted: boolean;
}

export interface Board {
  grid: (Checker | null)[][];
}

export function isValidCoordinate(position: Position): boolean {
  return position.x < 8 && position.x >= 0 && position.y < 8 && position.y >= 0;
}

export function getNonCaptureMoves(piece: Checker, board: Board): Position[] {
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

export function getCaptureMoves(piece: Checker, board: Board): Position[] {
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

export function makeMove(
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
  let captureMade: boolean = false;

  if (Math.abs(initial.x - final.x) === 2) {
    captureMade = true;
    tempGrid[(initial.y + final.y) / 2][(initial.x + final.x) / 2] = null;
  }

  let nextTurnType: TurnType =
    captureMade &&
    getCaptureMoves(tempGrid[final.y][final.x]!, { grid: tempGrid }).length > 0
      ? TurnType.Continue
      : TurnType.Next;
  let otherTurn: Turn =
    prevState.turn === Turn.RedTurn ? Turn.BlackTurn : Turn.RedTurn;
  let nextTurn: Turn =
    nextTurnType === TurnType.Continue ? prevState.turn : otherTurn;

  return {
    board: { grid: tempGrid },
    turn: nextTurn,
    turnType: nextTurnType,
    gameOver: prevState.gameOver,
    currentPieceLocation: final,
  };
}

export function newState(): CheckersState {
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
  return {
    board: board,
    turn: Turn.RedTurn,
    turnType: TurnType.Next,
    gameOver: false,
    currentPieceLocation: { x: -1, y: -1 },
  };
}

export function gameOver(gameState: CheckersState): boolean {
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
        return false;
    }
  }
  return true;
}

export function isValidPiece(
  pieceX: number,
  pieceY: number,
  gameState: CheckersState
): boolean {
  return (
    isValidCoordinate({ x: pieceX, y: pieceY }) &&
    gameState.board.grid[pieceY][pieceX] !== null &&
    ((gameState.board.grid[pieceY][pieceX]!.colour === Colour.Red &&
      gameState.turn === Turn.RedTurn) ||
      (gameState.board.grid[pieceY][pieceX]!.colour === Colour.Black &&
        gameState.turn === Turn.BlackTurn)) &&
    getCaptureMoves(
      gameState.board.grid[pieceY][pieceX]!,
      gameState.board
    ).concat(
      getNonCaptureMoves(gameState.board.grid[pieceY][pieceX]!, gameState.board)
    ).length > 0
  );
}
