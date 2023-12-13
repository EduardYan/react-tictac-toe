import { useState } from "react";
import confetti from "canvas-confetti"
import Square from "./components/Square.jsx";
import { TURNS } from "./constants.js";
import { checkWinnerFrom, checkEndGame } from "./logic/board.js";
import WinnerModal from "./components/WinnerModal.jsx";
import Game from "./components/Game.jsx";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });
  //null esque no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    //resetiando a los valores iniciales
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const updateBoard = (index) => {
    //no actualizamos esta posicion
    //si ya tiene algo
    if (board[index] || winner) return;

    //actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    //actualizar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    //guardar aqui partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", turn);

    //revisar si hay un ganador
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <Game board={board} updateBoard={updateBoard} />

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame} />
    </main>
  );
}

export default App;
