import React, { useState, useEffect } from "react";
import Card from "./Card.jsx";
import "./GameBoard.css";
import GameFinished from "./GameFinished.jsx";
//Steph: Importing wildcard
import WildCard from "./WildCard.jsx";

const GameBoard = ({ game }) => {
  const [text, setText] = useState([]);
  const [cardsClicked, setCardsClicked] = useState({
    first: null,
    second: null,
  });
  const [isMatch, setIsMatch] = useState(null);
  const [matches, setMatches] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [disableClicks, setDisableClicks] = useState(false); // New state variable
  //Steph: mapping down the elements that have been paired up already and which ones not
  const matchedPaires = game.matches.map((e) => e); //this will give me the URLs of the matched pairs
  const unmatchedPaires = [];

  game.board.map((e) => {
    if (
      !matchedPaires.includes(e.image_url) &&
      e.image_url !==
        "https://cdn.bfldr.com/Z0BJ31FP/at/vjc7chngjc36vgpxmr3fhm7x/golden-card-icon.svg"
    ) {
      unmatchedPaires.push(e);
    }
  });

  console.log(unmatchedPaires);
  console.log(matchedPaires);

  //Steph: added new function to implement if wildcard was clicked
  const handleWildCardClick = () => {
    if (cardsClicked.first === null) {
      // then access the first card that has not been matched yet and find its pair and then do this:
      /*         setCardsClicked(() => ({
        first: indexofFirstUnmatchedCard,
        second: matchingSecondCard
      }));
      } else if (cardsClicked.first !== null && cardsClicked.second === null) {
        setCardsClicked((prevState) => ({
          ...prevState,
          second: matchingSecondCardOfWhicheverCardWasClickedFirst,
        })); */
    }
  };

  const handleCardClickCallback = (index) => {
    if (disableClicks) return; // Return early if clicks are disabled

    //Steph: check if wildcard was clicked! if yes, only then go into the logic of the wildcard
    if (
      game.board[index].image_url ===
      "https://cdn.bfldr.com/Z0BJ31FP/at/vjc7chngjc36vgpxmr3fhm7x/golden-card-icon.svg"
    ) {
      handleWildCardClick();
    }

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

    setDisableClicks(false); // Re-enable clicks after resetting
    setIsMatch(null);
  };

  const checkMatches = (firstImageUrl, secondImageUrl) => {
    //Steph: changed the name of this function from checkMatch to checkMatches, because I think this was causing a glitch on my computer when the method in the next line was called
    if (!game.checkMatch(firstImageUrl, secondImageUrl)) {
      setIsMatch("not a match");
    } else {
      console.log("Match"); //Steph: No idea why, but there was a glitch where without the console.log, isMatch is never set to "match" even though setMatches(game.matches.length) is updated! No idea why, so I'm leaving the console.log for now
      setIsMatch("match");
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

      checkMatches(firstImageUrl, secondImageUrl);

      setDisableClicks(true); // Disable clicks during the delay

      setTimeout(() => {
        resetCardsClicked();
      }, 1500);
    }
  }, [cardsClicked]);

  useEffect(() => {
    processText(game.board);
  }, [game.board]);

  useEffect(() => {
    //Steph: Add minus 1 here in the calculation to not count the wildcard
    if (matches === (game.board.length - 1) / 2 && isMatch === "match") {
      setTimeout(() => {
        setIsWon(true);
      }, 2000);
    }
  }, [matches, isMatch]);

  return (
    <>
      {isWon ? (
        <GameFinished />
      ) : (
        <div className="gameBoard" id="gameBoard">
          {game.board.map((element, index) => {
            // Steph: basically copying your code and rendering the wildcard
            if (element.isWildcard) {
              return (
                <WildCard
                  key={index}
                  handleCardClickCallback={() => handleCardClickCallback(index)}
                  isMatch={isMatch}
                  disableClicks={disableClicks}
                  board={game.board}
                  cardsClicked={cardsClicked}
                  setCardsClicked={setCardsClicked}
                />
              );
            } else {
              return (
                <Card
                  key={index}
                  imgSrc={element.image_url}
                  text={text[index]}
                  board={game.board}
                  handleCardClickCallback={() => handleCardClickCallback(index)}
                  isMatch={isMatch}
                  disableClicks={disableClicks} // Pass the disableClicks state as a prop
                />
              );
            }
          })}
        </div>
      )}
    </>
  );
};

export default GameBoard;
