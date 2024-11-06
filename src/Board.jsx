import { create } from "zustand";
import { combine } from "zustand/middleware";
import Square from "./Square";

const useGameStore = create(
  combine({ squares: Array(9).fill(null), xIsNext: true }, (set) => ({
    setSquares: (nextSquares) => set({ squares: nextSquares }),
    setXIsNext: (nextXIsNext) =>
      set({
        xIsNext:
          typeof nextXIsNext === "function"
            ? nextXIsNext(state.xIsNext)
            : nextXIsNext,
      }),
    reset: () => set({ squares: Array(9).fill(null), xIsNext: true }),
  }))
);

export default function Board() {
  const { squares, xIsNext, setSquares, setXIsNext, reset } = useGameStore();
  const winner = calculateWinner(squares);
  const turns = calculateTurns(squares);
  const player = xIsNext ? "X" : "0";
  const status = calculateStatus(winner, turns, player);

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = player;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <main>
      <div className="Status">{status}</div>
      <div className="Board">
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
      <button className="reset-button" onClick={reset}>
        Reset Game
      </button>
    </main>
  );
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
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length;
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return "Draw";
  if (winner) return `Winner ${winner}`;
  return `Next player: ${player}`;
}
