import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';

const ChessBoard = ({ onMove, onExplain }) => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState('');
  const [lastMove, setLastMove] = useState(null);
  const engineRef = useRef(null);
  
  useEffect(() => {
    console.log('Chess engine would be initialized here');
    
    engineRef.current = {
      postMessage: (msg) => console.log('Engine command:', msg),
      simulateResponse: (move) => {
        console.log('Engine simulating response for move:', move);
        return { bestMove: 'e2e4' };
      }
    };
    
    return () => {
      console.log('Chess engine would be cleaned up here');
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
    if (!engineRef.current) return null;
    
    engineRef.current.postMessage(`position fen ${game.fen()}`);
    
    const response = engineRef.current.simulateResponse(game.fen());
    
    return { from: 'e2', to: 'e4' };
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
