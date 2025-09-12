import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Clock, User, Bot, Crown, Zap } from "lucide-react";

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

type Board = (ChessPiece | null)[][];

const initialBoard: Board = [
  [
    { type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }
  ]
];

const pieceUnicode = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

export const Chess = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('ai');
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'stalemate'>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // AI Move Logic
  const getAllValidMoves = (board: Board, color: PieceColor): Array<{from: [number, number], to: [number, number], piece: ChessPiece}> => {
    const moves: Array<{from: [number, number], to: [number, number], piece: ChessPiece}> = [];
    
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                moves.push({
                  from: [fromRow, fromCol],
                  to: [toRow, toCol],
                  piece
                });
              }
            }
          }
        }
      }
    }
    return moves;
  };

  const evaluateBoard = (board: Board): number => {
    const pieceValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 0
    };

    let score = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const value = pieceValues[piece.type];
          score += piece.color === 'white' ? value : -value;
        }
      }
    }
    return score;
  };

  const makeAIMove = () => {
    if (currentPlayer !== 'black' || gameMode !== 'ai') return;
    
    setIsThinking(true);
    
    setTimeout(() => {
      const validMoves = getAllValidMoves(board, 'black');
      if (validMoves.length === 0) {
        setIsThinking(false);
        return;
      }

      // Simple AI: Random move with slight preference for captures
      const captureMoves = validMoves.filter(move => 
        board[move.to[0]][move.to[1]] !== null
      );
      
      const selectedMove = captureMoves.length > 0 && Math.random() > 0.3 
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : validMoves[Math.floor(Math.random() * validMoves.length)];
      
      const newBoard = board.map(row => [...row]);
      newBoard[selectedMove.to[0]][selectedMove.to[1]] = selectedMove.piece;
      newBoard[selectedMove.from[0]][selectedMove.from[1]] = null;
      
      setBoard(newBoard);
      setCurrentPlayer('white');
      setIsThinking(false);
      
      // Add move to history
      const move = `${selectedMove.piece.type}${String.fromCharCode(97 + selectedMove.from[1])}${8 - selectedMove.from[0]} → ${String.fromCharCode(97 + selectedMove.to[1])}${8 - selectedMove.to[0]}`;
      setMoveHistory(prev => [...prev, `AI: ${move}`]);
    }, 1000 + Math.random() * 1500); // Random thinking time between 1-2.5 seconds
  };

  useEffect(() => {
    if (currentPlayer === 'black' && gameMode === 'ai' && !isThinking) {
      makeAIMove();
    }
  }, [currentPlayer, gameMode, board]);

  const resetGame = () => {
    setBoard(initialBoard.map(row => row.map(piece => piece ? { ...piece } : null)));
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setGameStatus('playing');
    setMoveHistory([]);
    setIsThinking(false);
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    // Simplified move validation - in a real chess game, this would be much more complex
    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== currentPlayer) return false;
    
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;
    
    // Basic movement rules (simplified)
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        if (fromCol === toCol && !targetPiece) {
          if (toRow === fromRow + direction) return true;
          if (fromRow === startRow && toRow === fromRow + 2 * direction) return true;
        }
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && targetPiece) {
          return true;
        }
        return false;
        
      case 'rook':
        return (rowDiff === 0 || colDiff === 0);
        
      case 'bishop':
        return rowDiff === colDiff;
        
      case 'queen':
        return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff);
        
      case 'king':
        return rowDiff <= 1 && colDiff <= 1;
        
      case 'knight':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
        
      default:
        return false;
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    // Prevent moves during AI thinking or if it's AI's turn
    if (isThinking || (gameMode === 'ai' && currentPlayer === 'black')) return;
    
    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      
      if (fromRow === row && fromCol === col) {
        setSelectedSquare(null);
        return;
      }
      
      if (isValidMove(fromRow, fromCol, row, col)) {
        const newBoard = board.map(r => [...r]);
        const piece = newBoard[fromRow][fromCol];
        newBoard[row][col] = piece;
        newBoard[fromRow][fromCol] = null;
        
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setSelectedSquare(null);
        
        // Add move to history (simplified notation)
        const move = `${piece?.type}${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + col)}${8 - row}`;
        setMoveHistory(prev => [...prev, move]);
      } else {
        setSelectedSquare([row, col]);
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const getSquareClassName = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const piece = board[row][col];
    
    let className = "w-12 h-12 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 relative ";
    
    if (isLight) {
      className += "bg-amber-50 hover:bg-amber-100 ";
    } else {
      className += "bg-amber-900 hover:bg-amber-800 ";
    }
    
    if (isSelected) {
      className += "ring-4 ring-primary glow-primary ";
    }
    
    // Add visual feedback for AI thinking
    if (isThinking && piece && piece.color === 'black') {
      className += "animate-pulse ";
    }
    
    return className;
  };

  const getPieceClassName = (piece: ChessPiece) => {
    let className = "select-none animate-scale-in ";
    
    if (piece.color === 'white') {
      className += "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] ";
    } else {
      className += "text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] ";
    }
    
    return className;
  };

  return (
    <div className="h-full bg-background text-foreground p-4 flex gap-6">
      {/* Game Board */}
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-center mb-2 gradient-text">Nova Chess</h1>
          
          {/* Game Status */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${currentPlayer === 'white' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                <User className="w-4 h-4" />
                <span>White</span>
                {currentPlayer === 'white' && !isThinking && <Crown className="w-4 h-4" />}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${currentPlayer === 'black' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                {gameMode === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span>Black {gameMode === 'ai' ? '(AI)' : ''}</span>
                {currentPlayer === 'black' && !isThinking && <Crown className="w-4 h-4" />}
                {isThinking && <Zap className="w-4 h-4 animate-pulse text-amber-500" />}
              </div>
            </div>
            
            <Badge variant="outline" className="mb-2">
              <Clock className="w-4 h-4 mr-2" />
              {isThinking ? 'AI is thinking...' : `Turn: ${currentPlayer}`}
            </Badge>
          </div>
        </div>

        {/* Chess Board */}
        <div className="glass rounded-xl p-4 mb-4">
          <div className="grid grid-cols-8 border-2 border-amber-900 rounded-lg overflow-hidden shadow-lg">
            {board.map((row, rowIndex) => 
              row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getSquareClassName(rowIndex, colIndex)}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece && (
                    <span className={getPieceClassName(piece)}>
                      {pieceUnicode[piece.color][piece.type]}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Board coordinates */}
          <div className="flex justify-between mt-2 px-2 text-xs text-muted-foreground">
            <span>a</span><span>b</span><span>c</span><span>d</span>
            <span>e</span><span>f</span><span>g</span><span>h</span>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex gap-4">
          <Button onClick={resetGame} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
          
          <Button 
            onClick={() => {
              if (!isThinking) {
                setGameMode(gameMode === 'pvp' ? 'ai' : 'pvp');
                resetGame();
              }
            }}
            variant="ghost"
            disabled={isThinking}
          >
            {gameMode === 'pvp' ? <User className="w-4 h-4 mr-2" /> : <Bot className="w-4 h-4 mr-2" />}
            {gameMode === 'pvp' ? 'Player vs Player' : 'Player vs AI'}
          </Button>
        </div>
      </div>

      {/* Side Panel */}
      <div className="flex-1 space-y-4">
        {/* Move History */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-3">Move History</h3>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {moveHistory.length === 0 ? (
              <p className="text-muted-foreground text-sm">No moves yet</p>
            ) : (
              moveHistory.map((move, index) => (
                <div key={index} className="text-sm py-1 px-2 rounded bg-muted/50">
                  {index + 1}. {move}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Game Rules */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-3">Quick Rules</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Click a piece to select it, then click where you want to move</p>
            <p>• White moves first</p>
            <p>• Each piece has unique movement patterns</p>
            <p>• Capture opponent pieces by moving to their square</p>
            <p>• Protect your King at all costs!</p>
          </div>
        </div>

        {/* Piece Guide */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-3">Piece Values</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">♛</span>
              <span>Queen (9)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">♜</span>
              <span>Rook (5)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">♝</span>
              <span>Bishop (3)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">♞</span>
              <span>Knight (3)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">♟</span>
              <span>Pawn (1)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">♚</span>
              <span>King (∞)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};