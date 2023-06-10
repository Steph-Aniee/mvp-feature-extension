import React, { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard.jsx";

import "./App.css";
import MatchingGame from "./matchingGame.js";

function App() {
  const [adjectives, setAdjectives] = useState([]);
  const [randomAdjectives, setRandomAdjectives] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (adjectives.length > 0) {
      const shuffledAdjectives = shuffleArray(adjectives);
      // Here you can set the limit on how many objects will be taking into consideration to create the game board
      setRandomAdjectives(shuffledAdjectives.slice(0, 7));
    }
  }, [adjectives]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api");
      const data = await response.json();
      setAdjectives(data);
    } catch (error) {
      console.log(error);
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const newGame = new MatchingGame(randomAdjectives);

  return <div className="app">{newGame && <GameBoard game={newGame} />}</div>;
}

export default App;
