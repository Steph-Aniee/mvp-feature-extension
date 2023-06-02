import React, { useState, useEffect } from 'react';
import Card from './Card.jsx';
import './GameBoard.css';
import GameFinished from './GameFinished.jsx';

const GameBoard = ({ game }) => {
  const [text, setText] = useState([]);
  const [cardsClicked, setCardsClicked] = useState({
    first: null,
    second: null,
  });
  const [isMatch, setIsMatch] = useState(null);
  const [matches, setMatches] = useState(null);
  const [isWon, setIsWon] = useState(false);

  const handleCardClickCallback = (index) => {
    if (cardsClicked.first === null) {
      setCardsClicked((prevState) => ({
        ...prevState,
        first: index,
      }));
    } else if (cardsClicked.second === null) {
      setCardsClicked((prevState) => ({
        ...prevState,
        second: index,
      }));
    }
  };

  const resetCardsClicked = () => {
    setCardsClicked({
      first: null,
      second: null,
    });

    setIsMatch(null);
  };

  const checkMatch = (firstImageUrl, secondImageUrl) => {
    if (!game.checkMatch(firstImageUrl, secondImageUrl)) {
      setIsMatch('not a match');
    } else {
      setIsMatch('match');
      setMatches(game.matches.length);
    }
  };

  const processText = (list) => {
    const newText = list.map((element) => element.spanish);
    const english = list.map((element) => element.english);

    newText.forEach((word, index) => {
      const occurrences = newText.filter((w, i) => w === word);
      if (occurrences.length > 1) {
        const englishEquivalent = english[index];
        newText[index] = englishEquivalent;
      }
    });

    setText(newText);
  };

  useEffect(() => {
    if (cardsClicked.first !== null && cardsClicked.second !== null) {
      const firstImageUrl = game.board[cardsClicked.first].image_url;
      const secondImageUrl = game.board[cardsClicked.second].image_url;

      checkMatch(firstImageUrl, secondImageUrl);

      setTimeout(() => {
        resetCardsClicked();
      }, 1500);
    }
  }, [cardsClicked]);

  useEffect(() => {
    processText(game.board);
  }, [game.board]);

  useEffect(() => {
    if (matches === game.board.length / 2 && isMatch === 'match') {
      setTimeout(() => {
        setIsWon(true);
      }, 2500);
    }
  }, [matches, isMatch]);

  return (
    <div>
      {isWon ? (
        <GameFinished />
      ) : (
        <div className="gameBoard" id="gameBoard">
          {game.board.map((element, index) => (
            <Card
              key={index}
              imgSrc={element.image_url}
              text={text[index]}
              board={game.board}
              handleCardClickCallback={() => handleCardClickCallback(index)}
              isMatch={isMatch}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
