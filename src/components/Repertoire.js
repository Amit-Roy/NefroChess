import React, { useState } from 'react';
import { Chess } from 'chess.js';

const Repertoire = ({ initialPgn, onSave }) => {
  const [name, setName] = useState('');
  const [pgn, setPgn] = useState(initialPgn || '');
  const [notes, setNotes] = useState('');
  const [savedRepertoires, setSavedRepertoires] = useState([]);

  const validatePgn = (pgnText) => {
    try {
      const chess = new Chess();
      chess.loadPgn(pgnText);
      return true;
    } catch (error) {
      console.error('Invalid PGN:', error);
      return false;
    }
  };

  const saveRepertoire = () => {
    if (!name.trim()) {
      alert('Please provide a name for your repertoire');
      return;
    }

    if (!validatePgn(pgn)) {
      alert('Invalid PGN format');
      return;
    }

    const newRepertoire = {
      id: Date.now().toString(),
      name,
      pgn,
      notes,
      createdAt: new Date().toISOString(),
    };

    setSavedRepertoires([...savedRepertoires, newRepertoire]);
    
    if (onSave) {
      onSave(newRepertoire);
    }

    setName('');
    setPgn('');
    setNotes('');
  };

  const downloadPgn = (repertoire) => {
    const pgnContent = repertoire.pgn;
    const blob = new Blob([pgnContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repertoire.name.replace(/\s+/g, '_')}.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="repertoire-container">
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Create Repertoire</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="My Sicilian Defense"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">PGN</label>
          <textarea
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="Paste PGN here or use the current game"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded h-24"
            placeholder="Add your notes and annotations here"
          />
        </div>
        
        <button
          onClick={saveRepertoire}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Repertoire
        </button>
      </div>
      
      {savedRepertoires.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Saved Repertoires</h3>
          <div className="repertoire-list">
            {savedRepertoires.map((rep) => (
              <div key={rep.id} className="repertoire-item">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">{rep.name}</h4>
                  <div>
                    <button
                      onClick={() => downloadPgn(rep)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 mr-2"
                    >
                      Download PGN
                    </button>
                  </div>
                </div>
                {rep.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{rep.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Repertoire;
