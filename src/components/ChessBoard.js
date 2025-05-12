import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import * as Stockfish from 'stockfish';

const ChessBoard = ({ onMove, onExplain }) => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState('');
  const [lastMove, setLastMove] = useState(null);
  const engineRef = useRef(null);
  
  useEffect(() => {
    engineRef.current = Stockfish();
    
    engineRef.current.onmessage = (event) => {
      const message = event.data;
      if (message.includes('bestmove')) {
        const bestMove = message.split(' ')[1];
        console.log('Engine suggests:', bestMove);
      }
    };
    
    engineRef.current.postMessage('uci');
    engineRef.current.postMessage('isready');
    
    return () => {
      if (engineRef.current) {
        engineRef.current.postMessage('quit');
      }
    };
  }, []);
  
  useEffect(() => {
    setFen(game.fen());
  }, [game]);
  
  const makeMove = (move) => {
    try {
      const result = game.move(move);
      if (result) {
        setLastMove(result);
        setFen(game.fen());
        
        if (onMove) onMove(result, game.fen());
        
        explainMove(result);
        
        return result;
      }
      return null;
    } catch (error) {
      console.error('Invalid move:', error);
      return null;
    }
  };
  
  const explainMove = (move) => {
    if (!move) return;
    
    const explanation = `The move ${move.san} ${
      move.color === 'w' ? '(White)' : '(Black)'
    } ${
      move.flags.includes('c') ? 'captures a piece' : 
      move.flags.includes('e') ? 'is an en passant capture' :
      move.flags.includes('p') ? 'promotes a pawn' :
      move.flags.includes('k') ? 'is a kingside castling move' :
      move.flags.includes('q') ? 'is a queenside castling move' :
      'is a standard move'
    }.`;
    
    if (onExplain) onExplain(explanation);
  };
  
  const getEngineMove = () => {
    if (!engineRef.current) return;
    
    engineRef.current.postMessage(`position fen ${game.fen()}`);
    engineRef.current.postMessage('go depth 15');
  };
  
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setLastMove(null);
  };
  
  return {
    fen,
    game,
    lastMove,
    makeMove,
    getEngineMove,
    resetGame
  };
};

export default ChessBoard;
