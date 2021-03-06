import React, { useState } from "react";
import "./Square.css";
import "./Board.css";
import "./checkersState";
import {
  Colour,
  TurnType,
  Turn,
  Board,
  Position,
  Checker,
  newState,
  CheckersState,
  getCaptureMoves,
  getNonCaptureMoves,
  makeMove,
  gameOver,
} from "./checkersState";

function Square(props: any) {
  let n: string = "";
  let crown_char: string = "";
  if (props.ch === null) n = "null_circle";
  else {
    if (props.ch === ".") n = "move_circle";
    else if (props.ch.toLowerCase() === "r") {
      n = "red_circle";
      if (props.ch === props.ch.toUpperCase()) crown_char = "black-crown";
    } else {
      n = "black_circle";
      if (props.ch === props.ch.toUpperCase()) crown_char = "white-crown";
    }
  }
  return (
    <div className={props.name} onClick={props.onClick}>
      <div className={n}>
        <div className="crown-container">
          <div className={crown_char}></div>
        </div>
      </div>
    </div>
  );
}

export function CheckerBoard() {
  const [checkersState, setCheckersState] = useState({
    gameState: newState(),
    currentPieceClicked: { x: -1, y: -1 },
    currentMovesDisplayed: [{ x: -1, y: -1 }],
  });

  function getNewCheckersState(i: number, j: number, reset: boolean = false) {
    if (reset) {
      setCheckersState({
        gameState: newState(),
        currentPieceClicked: { x: -1, y: -1 },
        currentMovesDisplayed: [{ x: -1, y: -1 }],
      });
      return;
    }
    let board: Board = checkersState.gameState.board;
    let turn: Turn = checkersState.gameState.turn;
    let square: Checker | null = board.grid[i][j];
    if (
      square === null &&
      checkersState.currentMovesDisplayed.some(
        (move) => move.x === j && move.y === i
      )
    ) {
      let newGameState: CheckersState = makeMove(
        checkersState.currentPieceClicked,
        { x: j, y: i },
        checkersState.gameState
      );
      if (newGameState.turnType === TurnType.Continue) {
        setCheckersState({
          gameState: newGameState,
          currentPieceClicked: newGameState.currentPieceLocation,
          currentMovesDisplayed: getCaptureMoves(
            newGameState.board.grid[newGameState.currentPieceLocation.y][
              newGameState.currentPieceLocation.x
            ]!,
            newGameState.board
          ),
        });
      } else {
        setCheckersState({
          gameState: makeMove(
            checkersState.currentPieceClicked,
            { x: j, y: i },
            checkersState.gameState
          ),
          currentPieceClicked: { x: -1, y: -1 },
          currentMovesDisplayed: [{ x: -1, y: -1 }],
        });
      }
    } else if (
      square != null &&
      ((square.colour === Colour.Red && turn === Turn.RedTurn) ||
        (square.colour === Colour.Black && turn === Turn.BlackTurn)) &&
      checkersState.gameState.turnType === TurnType.Next
    ) {
      let allMoves: Position[] = getCaptureMoves(square, board).concat(
        getNonCaptureMoves(square, board)
      );
      setCheckersState({
        gameState: checkersState.gameState,
        currentPieceClicked: square.position,
        currentMovesDisplayed: allMoves,
      });
    }
  }

  let bigboard = [];
  for (let i = 0; i < 8; i++) {
    let temp = [];
    for (let j = 0; j < 8; j++) {
      let square: Checker | null = checkersState.gameState.board.grid[i][j];
      let chr: string | null = null;
      if (square !== null) {
        let col: string = square!.colour === Colour.Red ? "r" : "b";
        chr = square!.hasPromoted ? col.toUpperCase() : col;
      } else {
        if (
          checkersState.currentMovesDisplayed.some(
            (move) => move.x === j && move.y === i
          )
        )
          chr = ".";
      }
      let name: string = (i + j) % 2 === 0 ? "square even" : "square odd";
      temp.push(
        <Square
          name={name}
          key={String(i) + String(j)}
          ch={chr}
          onClick={() => getNewCheckersState(i, j)}
        />
      );
    }
    bigboard.push(
      <div key={i} className="row">
        {temp}
      </div>
    );
  }
  let titleText: string = "";
  console.log(gameOver(checkersState.gameState));
  if (gameOver(checkersState.gameState)) {
    titleText =
      checkersState.gameState.turn === Turn.RedTurn
        ? "Black wins!"
        : "Red wins!";
  }
  return (
    <div className="bigboard-container">
      <div className="title">{titleText}</div>
      <div className="bigboard">{bigboard}</div>
      <div className="button-container">
        <button onClick={() => getNewCheckersState(-1, -1, true)}>
          New Game
        </button>
      </div>
    </div>
  );
}
