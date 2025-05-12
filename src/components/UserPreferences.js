import React, { useState } from 'react';

const UserPreferences = ({ onSave }) => {
  const [preferences, setPreferences] = useState({
    playStyle: '',
    favoriteOpenings: '',
    weakOpenings: '',
    skillLevel: '10', // Default to maximum
    preferredColor: 'both',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(preferences);
    }
  };

  return (
    <div className="user-preferences p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Your Chess Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Play Style
          </label>
          <select
            name="playStyle"
            value={preferences.playStyle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select your play style</option>
            <option value="aggressive">Aggressive</option>
            <option value="defensive">Defensive</option>
            <option value="positional">Positional</option>
            <option value="tactical">Tactical</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Favorite Openings
          </label>
          <textarea
            name="favoriteOpenings"
            value={preferences.favoriteOpenings}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24"
            placeholder="E.g., Sicilian Defense, Queen's Gambit, Ruy Lopez"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Openings You Struggle With
          </label>
          <textarea
            name="weakOpenings"
            value={preferences.weakOpenings}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24"
            placeholder="E.g., King's Indian Defense, French Defense"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Engine Skill Level (1-20)
          </label>
          <input
            type="range"
            name="skillLevel"
            min="1"
            max="20"
            value={preferences.skillLevel}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Preferred Color
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="preferredColor"
                value="white"
                checked={preferences.preferredColor === 'white'}
                onChange={handleChange}
                className="mr-2"
              />
              White
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preferredColor"
                value="black"
                checked={preferences.preferredColor === 'black'}
                onChange={handleChange}
                className="mr-2"
              />
              Black
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preferredColor"
                value="both"
                checked={preferences.preferredColor === 'both'}
                onChange={handleChange}
                className="mr-2"
              />
              Both
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default UserPreferences;
