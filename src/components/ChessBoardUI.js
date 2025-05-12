import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';

const ChessBoardUI = ({ onMove, engineMove }) => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const boardRef = useRef(null);
  
  const squareSize = 60; // Size of each square in pixels
  
  useEffect(() => {
    drawBoard();
  }, [game, selectedSquare]);
  
  const drawBoard = () => {
    if (!boardRef.current) return;
    
    const ctx = boardRef.current.getContext('2d');
    const board = game.board();
    
    ctx.clearRect(0, 0, boardRef.current.width, boardRef.current.height);
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareColor = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
        const x = boardOrientation === 'white' ? col * squareSize : (7 - col) * squareSize;
        const y = boardOrientation === 'white' ? row * squareSize : (7 - row) * squareSize;
        
        ctx.fillStyle = squareColor;
        ctx.fillRect(x, y, squareSize, squareSize);
        
        if (selectedSquare) {
          const [selectedRow, selectedCol] = algebraicToCoords(selectedSquare);
          if ((boardOrientation === 'white' && row === selectedRow && col === selectedCol) ||
              (boardOrientation === 'black' && row === 7 - selectedRow && col === 7 - selectedCol)) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }
        
        const piece = board[row][col];
        if (piece) {
          drawPiece(ctx, piece, x, y);
        }
      }
    }
  };
  
  const drawPiece = (ctx, piece, x, y) => {
    ctx.fillStyle = piece.color === 'w' ? '#fff' : '#000';
    ctx.strokeStyle = piece.color === 'w' ? '#000' : '#fff';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const pieceSymbols = {
      'p': '♟',
      'n': '♞',
      'b': '♝',
      'r': '♜',
      'q': '♛',
      'k': '♚'
    };
    
    ctx.fillText(pieceSymbols[piece.type], x + squareSize / 2, y + squareSize / 2);
    ctx.strokeText(pieceSymbols[piece.type], x + squareSize / 2, y + squareSize / 2);
  };
  
  const handleBoardClick = (e) => {
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);
    
    const clickedSquare = coordsToAlgebraic(
      boardOrientation === 'white' ? row : 7 - row,
      boardOrientation === 'white' ? col : 7 - col
    );
    
    if (selectedSquare) {
      try {
        const move = game.move({
          from: selectedSquare,
          to: clickedSquare,
          promotion: 'q' // Always promote to queen for simplicity
        });
        
        if (move) {
          setSelectedSquare(null);
          setGame(new Chess(game.fen()));
          
          if (onMove) {
            onMove(move, game.fen());
          }
          
          if (engineMove) {
            setTimeout(() => {
              const engineMoveResult = engineMove();
              if (engineMoveResult) {
                setGame(new Chess(game.fen()));
              }
            }, 500);
          }
        } else {
          setSelectedSquare(clickedSquare);
        }
      } catch (error) {
        console.error('Invalid move:', error);
        setSelectedSquare(clickedSquare);
      }
    } else {
      const piece = game.get(clickedSquare);
      if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
        setSelectedSquare(clickedSquare);
      }
    }
  };
  
  const algebraicToCoords = (algebraic) => {
    const col = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(algebraic[1]);
    return [row, col];
  };
  
  const coordsToAlgebraic = (row, col) => {
    const file = String.fromCharCode('a'.charCodeAt(0) + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  };
  
  const flipBoard = () => {
    setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white');
  };
  
  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
  };
  
  return (
    <div className="chess-board-container">
      <canvas
        ref={boardRef}
        width={8 * squareSize}
        height={8 * squareSize}
        onClick={handleBoardClick}
        className="chess-board"
      />
      <div className="mt-4 flex justify-between">
        <button
          onClick={flipBoard}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Flip Board
        </button>
        <button
          onClick={resetGame}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default ChessBoardUI;
