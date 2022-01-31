import React, { useState } from "react";
import "./Square.css";
import "./Board.css";

function Square(props: any) {
  return (
    <div className="square" onClick={props.onClick}>
      {props.ch}
    </div>
  );
}

enum Colour {
  Red = 1,
  Black = 2,
}

interface Checker {
  colour: Colour;
  x: number;
  y: number;
  hasPromoted: boolean;
}

export function Board() {
  const [redsTurn, setTurn] = useState(true);
  const [validPieceSelected, setValidPieceSelected] = useState(false);
  const [board, setBoard] = useState([
    [
      null,
      { colour: Colour.Black, x: 1, y: 0, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 3, y: 0, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 5, y: 0, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 7, y: 0, hasPromoted: false },
    ],
    [
      { colour: Colour.Black, x: 0, y: 1, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 2, y: 1, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 4, y: 1, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 6, y: 1, hasPromoted: false },
      null,
    ],
    [
      null,
      { colour: Colour.Black, x: 1, y: 2, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 3, y: 2, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 5, y: 2, hasPromoted: false },
      null,
      { colour: Colour.Black, x: 7, y: 2, hasPromoted: false },
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      { colour: Colour.Red, x: 0, y: 5, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 2, y: 5, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 4, y: 5, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 6, y: 5, hasPromoted: false },
      null,
    ],
    [
      null,
      { colour: Colour.Red, x: 1, y: 6, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 3, y: 6, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 5, y: 6, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 7, y: 6, hasPromoted: false },
    ],
    [
      { colour: Colour.Red, x: 0, y: 7, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 2, y: 7, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 4, y: 7, hasPromoted: false },
      null,
      { colour: Colour.Red, x: 6, y: 7, hasPromoted: false },
      null,
    ],
  ]);
  const [displayBoard, setDisplayBoard] = useState(makeDisplayBoard());

  function isValidCoordinate(coordinate: number[]) {
    return (
      coordinate[0] >= 0 &&
      coordinate[0] < 8 &&
      coordinate[1] >= 0 &&
      coordinate[1] < 8
    );
  }

  function getMoves(x: number, y: number) {
    displayMoves(getNonCaptureMoves(x, y).concat(getCaptureMoves(x, y)));
  }
  function getNonCaptureMoves(x: number, y: number) {
    let moves: number[][];
    let directionFactor: number = board[y][x]!.colour === Colour.Red ? -1 : 1;
    //get possible move locations
    if (board[y][x]!.hasPromoted)
      moves = [
        [x + 1, y + 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
        [x - 1, y - 1],
      ];
    else
      moves = [
        [x + 1, y + directionFactor],
        [x - 1, y + directionFactor],
      ];

    let filteredMoves: number[][] = [];
    for (let i = 0; i < moves.length; i++) {
      if (
        isValidCoordinate(moves[i]) &&
        board[moves[i][1]][moves[i][0]] == null
      ) {
        filteredMoves.push(moves[i]);
      }
    }
    return filteredMoves;
  }

  function getCaptureMoves(x: number, y: number) {
    let moves: number[][];
    let directionFactor: number = board[y][x]!.colour === Colour.Red ? -1 : 1;

    if (board[y][x]!.hasPromoted) {
      moves = [
        [x + 2, y + 2],
        [x - 2, y + 2],
        [x + 2, y - 2],
        [x - 2, y - 2],
      ];
    } else {
      moves = [
        [x + 2, y + 2 * directionFactor],
        [x - 2, y + 2 * directionFactor],
      ];
    }

    let filtered_moves: number[][] = [];

    for (let i = 0; i < moves.length; i++) {
      let move_x: number = moves[i][0];
      let move_y: number = moves[i][1];

      if (
        isValidCoordinate(moves[i]) &&
        board[move_y][move_x] == null &&
        board[(move_y + y) / 2][(move_x + x) / 2] != null &&
        board[(move_y + y) / 2][(move_x + x) / 2]?.colour !==
          board[y][x]!.colour
      ) {
        filtered_moves.push(moves[i]);
      }
    }
    return filtered_moves;
  }

  function makeDisplayBoard() {
    let tempBoard: (string | null)[][] = [];
    for (let i = 0; i < 8; i++) {
      let temp: (string | null)[] = [];
      for (let j = 0; j < 8; j++) {
        if (!board[i][j]) temp.push(null);
        else {
          if (board[i][j]!.colour === Colour.Red) {
            if (board[i][j]!.hasPromoted) temp.push("R");
            else temp.push("r");
          } else {
            if (board[i][j]!.hasPromoted) temp.push("B");
            else temp.push("b");
          }
        }
      }
      tempBoard.push(temp);
    }
    return tempBoard;
  }

  function displayMoves(moves: number[][]) {
    let tempBoard: (string | null)[][] = displayBoard;
    // clear board of existing moves that are displayed
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (tempBoard[i][j]! === ".") tempBoard[i][j] = null;
      }
    }
    // place marker on squares where valid piece can move
    for (let i = 0; i < moves.length; i++)
      tempBoard[moves[i][1]][moves[i][0]] = ".";

    setDisplayBoard(tempBoard);
    console.log(tempBoard);
  }

  let bigboard = [];
  for (let i = 0; i < 8; i++) {
    let temp = [];
    for (let j = 0; j < 8; j++) {
      temp.push(
        <Square ch={displayBoard[i][j]} onClick={() => getMoves(j, i)} />
      );
    }
    bigboard.push(<div className="row">{temp}</div>);
  }
  return <div className="bigboard">{bigboard}</div>;
}
