import { useEffect, useState } from "react";
import { Square } from "./Components/Square";
import confetti from "canvas-confetti";
import { TURNS } from "./constants";
import { checkWinner, checkEndGame } from "./logic/board";
import { WinnerModal } from "./Components/WinnerModal";

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

   const [winner, setWinner] = useState(() => {
      const newWinner = window.localStorage.getItem("winner");
      return newWinner ?? null;
   });

   const resetGame = () => {
      setBoard(Array(9).fill(null));
      setTurn(TURNS.X);
      setWinner(null);
      window.localStorage.removeItem("board");
      window.localStorage.removeItem("turn");
   };

   const updateBoard = (index) => {
      if (board[index] || winner) return;

      //actualizar tablero
      const newBoard = [...board];
      newBoard[index] = turn;
      setBoard(newBoard);

      //cambiar turno
      const newTurn = turn == TURNS.X ? TURNS.O : TURNS.X;
      setTurn(newTurn);

      //guardar partida
      window.localStorage.setItem("board", JSON.stringify(newBoard));
      window.localStorage.setItem("turn", newTurn);

      //revisar si hay ganador
      const newWinner = checkWinner(newBoard);
      if (newWinner) {
         confetti();
         setWinner(newWinner);
         window.localStorage.setItem("winner", newWinner);
      } else if (checkEndGame(newBoard)) {
         setWinner(false);
      }
   };

   return (
      <main className="board">
         <h1>Tic tac toe</h1>
         <button onClick={resetGame}>Reiniciar Juego</button>
         <section className="game">
            {board.map((_, index) => {
               return (
                  <Square key={index} index={index} updateBoard={updateBoard}>
                     {board[index]}
                  </Square>
               );
            })}
         </section>

         <section className="turn">
            <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
            <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
         </section>

         <WinnerModal resetGame={resetGame} winner={winner} />
      </main>
   );
}

export default App;
