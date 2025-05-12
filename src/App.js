import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChessBoard from './components/ChessBoard';
import ChessBoardUI from './components/ChessBoardUI';
import MoveExplanation from './components/MoveExplanation';
import Repertoire from './components/Repertoire';
import UserPreferences from './components/UserPreferences';

function App() {
  const [currentView, setCurrentView] = useState('game'); // 'game', 'repertoire', 'preferences'
  const [moveExplanation, setMoveExplanation] = useState('');
  const [currentFen, setCurrentFen] = useState('');
  const [userPreferences, setUserPreferences] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const chessBoardRef = useRef(null);
  
  useEffect(() => {
    chessBoardRef.current = ChessBoard({
      onMove: handleMove,
      onExplain: handleExplanation
    });
  }, []);
  
  const handleMove = (move, fen) => {
    setCurrentFen(fen);
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
    
    setMoveExplanation(explanation);
  };
  
  const handleExplanation = (explanation) => {
    setMoveExplanation(explanation);
  };
  
  const handleEngineMove = () => {
    if (chessBoardRef.current) {
      return chessBoardRef.current.getEngineMove();
    }
    return null;
  };
  
  const handleSavePreferences = (prefs) => {
    setUserPreferences(prefs);
    setShowWelcome(false);
    setCurrentView('game');
  };
  
  const handleSaveRepertoire = (repertoire) => {
    console.log('Saved repertoire:', repertoire);
  };
  
  const renderWelcomeScreen = () => {
    return (
      <div className="welcome-screen p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Welcome to NefroChess!</h2>
        <p className="mb-4">
          NefroChess is an AI-enabled chess game that helps you improve your chess skills
          and build your opening repertoire. Before we begin, please tell us a bit about
          your chess preferences so we can tailor the experience to you.
        </p>
        <UserPreferences onSave={handleSavePreferences} />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">NefroChess</h1>
            <p className="text-sm">AI-enabled chess game with repertoire creation</p>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={() => setCurrentView('game')}
                  className={`px-3 py-1 rounded ${currentView === 'game' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                >
                  Game
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('repertoire')}
                  className={`px-3 py-1 rounded ${currentView === 'repertoire' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                >
                  Repertoire
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('preferences')}
                  className={`px-3 py-1 rounded ${currentView === 'preferences' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
                >
                  Preferences
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {showWelcome ? (
          renderWelcomeScreen()
        ) : (
          <div>
            {currentView === 'game' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ChessBoardUI
                    onMove={handleMove}
                    engineMove={handleEngineMove}
                  />
                </div>
                <div>
                  <MoveExplanation explanation={moveExplanation} />
                  {userPreferences && (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-2">Your Chess Profile</h3>
                      <p><strong>Play Style:</strong> {userPreferences.playStyle}</p>
                      <p><strong>Engine Level:</strong> {userPreferences.skillLevel}/20</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {currentView === 'repertoire' && (
              <Repertoire
                initialPgn={currentFen ? `[FEN "${currentFen}"]` : ''}
                onSave={handleSaveRepertoire}
              />
            )}
            
            {currentView === 'preferences' && (
              <UserPreferences
                onSave={handleSavePreferences}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
