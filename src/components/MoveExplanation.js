import React from 'react';

const MoveExplanation = ({ explanation }) => {
  if (!explanation) {
    return null;
  }

  return (
    <div className="move-explanation">
      <h3 className="text-lg font-semibold mb-2">Move Analysis</h3>
      <p>{explanation}</p>
    </div>
  );
};

export default MoveExplanation;
