import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trophy, Users } from "lucide-react";

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

export const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({ xWins: 0, oWins: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (board: Board): Player | 'draw' | null => {
    // Check for winning combinations
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    // Check for draw
    if (board.every(cell => cell !== null)) {
      return 'draw';
    }
    
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      // Update stats
      setGameStats(prev => ({
        ...prev,
        xWins: gameResult === 'X' ? prev.xWins + 1 : prev.xWins,
        oWins: gameResult === 'O' ? prev.oWins + 1 : prev.oWins,
        draws: gameResult === 'draw' ? prev.draws + 1 : prev.draws
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const resetStats = () => {
    setGameStats({ xWins: 0, oWins: 0, draws: 0 });
  };

  const getCellClassName = (index: number) => {
    let baseClass = "w-20 h-20 glass rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-200 hover:glow-primary hover:scale-105";
    
    if (board[index] === 'X') {
      baseClass += " text-primary glow-primary";
    } else if (board[index] === 'O') {
      baseClass += " text-accent glow-accent";
    }
    
    if (winner) {
      baseClass += " cursor-not-allowed opacity-75";
    }
    
    return baseClass;
  };

  return (
    <div className="h-full bg-background text-foreground p-6 flex flex-col items-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4 gradient-text">Tic Tac Toe</h1>
        
        {/* Game Status */}
        <div className="text-center mb-6">
          {winner ? (
            <div className="space-y-2">
              {winner === 'draw' ? (
                <div className="text-xl text-muted-foreground">It's a Draw!</div>
              ) : (
                <div className="text-xl">
                  <span className={winner === 'X' ? 'text-primary' : 'text-accent'}>
                    Player {winner}
                  </span>
                  <span className="text-foreground"> Wins!</span>
                  <Trophy className="w-6 h-6 inline ml-2 text-amber-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-xl">
              Current Player: 
              <span className={currentPlayer === 'X' ? 'text-primary ml-2 font-bold' : 'text-accent ml-2 font-bold'}>
                {currentPlayer}
              </span>
            </div>
          )}
        </div>

        {/* Game Stats */}
        <div className="flex justify-center gap-4 mb-6">
          <Badge variant="outline" className="px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            X: {gameStats.xWins}
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            O: {gameStats.oWins}
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            Draws: {gameStats.draws}
          </Badge>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {board.map((cell, index) => (
          <button
            key={index}
            className={getCellClassName(index)}
            onClick={() => handleCellClick(index)}
            disabled={!!winner || !!cell}
          >
            {cell && (
              <span className="animate-scale-in">
                {cell}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <Button 
          onClick={resetGame}
          variant="outline"
          className="px-6"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
        
        <Button 
          onClick={resetStats}
          variant="ghost"
          className="px-6"
        >
          Reset Stats
        </Button>
      </div>

      {/* Game Rules */}
      <div className="mt-8 glass rounded-xl p-4 max-w-md">
        <h3 className="font-semibold mb-2">How to Play:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Players take turns placing X's and O's</li>
          <li>• First to get 3 in a row wins</li>
          <li>• Get 3 across, down, or diagonally</li>
          <li>• If all 9 squares are filled, it's a draw</li>
        </ul>
      </div>
    </div>
  );
};