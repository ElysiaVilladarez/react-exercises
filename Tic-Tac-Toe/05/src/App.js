import { useState } from 'react';

function Square({value,  onSquareClick, buttonClasses}) {
  const classes = `square ${buttonClasses}`;
  return (
    <button className={classes} onClick={onSquareClick}>{value}</button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  const calculation = calculateWinner(squares);
  const winner = calculation?.winner;
  const allCellsOccupied = !squares.some((s) => s === null);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (allCellsOccupied) {
    status = `Results are a DRAW`
  } else {
    status = `Next Player: ${xIsNext ? "X" : "O"}`
  }
  const boardRows = [];
  let boardCol = [];
  for (let i = 0; i < squares.length; i++) {
    const innerClasses = calculation?.winningIndices?.includes(i) ? "winning-cell" : ""
    boardCol.push((
      <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} buttonClasses={innerClasses} />
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
    if (squares[i] || calculateWinner(squares)?.winner) {
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
  const [history, setHistory] = useState([{moveNum: 0, squares: Array(9).fill(null)}]);
  const [currentMove, setCurrentMove] = useState(0);
  let currentSquares = history.find((h) =>  h.moveNum === currentMove ).squares;
  let xIsNext = currentMove % 2 === 0 ? true : false;
  const [isAscending, setIsAscending] = useState(true);
  function jumpTo(moveNum) {
    const jumpBackIndex = history.findIndex((h) =>  h.moveNum === moveNum );
    const newHistory = isAscending ? history.slice(0, jumpBackIndex+1) : history.slice(jumpBackIndex);
    setHistory(newHistory);
    setCurrentMove(moveNum);
  }
  const historyButtons = history.map((h) => {
    let description;
    if (h.moveNum === currentMove) {
      return (
        <li key={h.moveNum}>
          <span>You are at move #{h.moveNum}</span>
        </li>
      )
    } else if (h.moveNum > 0) {
      description = `Go to #${h.moveNum}`
    } else {
      description = `Go to game start`
    }
    return (
      <li key={h.moveNum}>
        <button onClick={() => jumpTo(h.moveNum)}>{description}</button>
      </li>
    )
  })
  function handlePlay(nextSquares) {
    if (isAscending) {
      setHistory([...history, { moveNum: history.length, squares: nextSquares }]);
    } else {
      setHistory([{ moveNum: history.length, squares: nextSquares }, ...history]);
    }
    setCurrentMove(currentMove+1)
  }
  function toggleOrder() {
    setIsAscending(!isAscending);
    const newHistory = [];
    for (let i = history.length - 1; i > -1; i--) {
      newHistory.push(history[i])
    }
    setHistory(newHistory);
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleOrder}>Order: {isAscending ? "Ascending" : "Descending"}</button>
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
      return {
        winningIndices: lines[i],
        winner: squares[a]
      }
    }
  }
  return null;
}