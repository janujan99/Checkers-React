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
  isValidCoordinate,
  isValidPiece,
  getCaptureMoves,
  getNonCaptureMoves,
  makeMove,
} from "./checkersState";

function Square(props: any) {
  return (
    <div className="square" onClick={props.onClick}>
      {props.ch}
    </div>
  );
}

export function CheckerBoard() {
  const [checkersState, setCheckersState] = useState({
    gameState: newState(),
    currentPieceClicked: { x: -1, y: -1 },
    currentMovesDisplayed: [{ x: -1, y: -1 }],
  });

  function getNewCheckersState(i: number, j: number) {
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
  console.log("Render!");
  console.log(checkersState);
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
      temp.push(
        <Square
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
  return <div className="bigboard">{bigboard}</div>;
}
