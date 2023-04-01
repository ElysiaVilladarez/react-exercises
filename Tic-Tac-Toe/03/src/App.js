import { useState } from 'react';

function Square({value,  onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`
  } else {
    status = `Next Player: ${xIsNext ? "X" : "O"}`
  }
  const boardRows = [];
  let boardCol = [];
  for (let i = 0; i < squares.length; i++) {
    boardCol.push((
      <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
    ));
    if (boardCol.length === 3) {
      const boardColTemp = boardCol.slice();
      boardRows.push((
        <div key={Math.floor(i/3)} className="board-row">
          {boardColTemp}
        </div>
      ));
      boardCol = [];
    }
  }
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X"
    } else {
      nextSquares[i] = "O"
    }
    onPlay(nextSquares)
  }
  return (
      <>
      <div className="status">{status}</div>
      {boardRows}
      </>
  )
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  let currentSquares = history[currentMove];
  let xIsNext = currentMove % 2 === 0 ? true : false;
  function jumpTo(moveNum) {
    const newHistory = history.slice(0, moveNum+1);
    setHistory(newHistory);
    setCurrentMove(moveNum);
  }
  const historyButtons = history.map((squares, moveNum) => {
    let description;
    if (moveNum === currentMove) {
      return (
        <li key={moveNum}>
          <span>You are at move #{moveNum}</span>
        </li>
      )
    } else if (moveNum > 0) {
      description = `Go to #${moveNum}`
    } else {
      description = `Go to game start`
    }
    return (
      <li key={moveNum}>
        <button onClick={() => jumpTo(moveNum)}>{description}</button>
      </li>
    )
  })
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setCurrentMove(currentMove+1)
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{historyButtons}</ol>
      </div>
    </div>
  )
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}