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
  const matchedPairs = game.matches.map((e) => e); //this will give me the URLs of the matched pairs
  const unmatchedPairs = [];
  // Steph: starting to test the new state here
  const [fakeCardClicked, setFakeCardClicked] = useState(null);
  const [secondFakeCardClicked, setSecondFakeCardClicked] = useState(null);
  const [wildCardClicked, setWildCardClicked] = useState(null);

  //Steph: making sure that the wildcard itself will be excluded from the array of unmatched cards, so that it cannot pick itself for the rest of its logic
  game.board.map((e) => {
    if (
      !matchedPairs.includes(e.image_url) &&
      e.image_url !==
        "https://cdn.bfldr.com/Z0BJ31FP/at/vjc7chngjc36vgpxmr3fhm7x/golden-card-icon.svg"
    ) {
      unmatchedPairs.push(e); // pushing all other cards to the unmatched batch at the beginning of the game
    }
  });

  //Steph: added new function to implement its ogic if the wildcard was clicked
  const handleWildCardClick = () => {
    if (cardsClicked.first === null && unmatchedPairs.length > 0) {
      setWildCardClicked("both cards added");
      // access the first card that has not been matched yet
      const findPairs = unmatchedPairs[0];
      //find it plus its pair in the game board and push into a new array
      const matchingParts = game.board.filter(
        (e) => e.image_url === findPairs.image_url
      );
      if (matchingParts) {
        // ideally, matchingParts should consist of two elements
        const firstCardIndex = game.board.indexOf(matchingParts[0]);
        const secondCardIndex = game.board.indexOf(matchingParts[1]);
        //then re-use Judith's code:
        setCardsClicked(() => ({
          first: firstCardIndex,
          second: secondCardIndex,
        }));
      }
    } else if (cardsClicked.first !== null && cardsClicked.second === null) {
      setWildCardClicked("second card added");
      // Find the second part based on the image_url of the first part
      const firstPartImageUrl = game.board[cardsClicked.first].image_url;
      let secondPartIndex = null;

      for (let i = 0; i < game.board.length; i++) {
        const currentPart = game.board[i];
        if (
          currentPart.image_url === firstPartImageUrl &&
          i !== cardsClicked.first
        ) {
          secondPartIndex = i;
          break; // just to stop the loop once the second index/match of this card is found
        }
      }

      if (secondPartIndex !== null) {
        setCardsClicked((prevState) => ({
          ...prevState,
          second: secondPartIndex,
        }));
      }
    }
  };

  const handleCardClickCallback = (index) => {
    if (disableClicks) return; // Return early if clicks are disabled
    //Steph: check if wildcard was clicked; if yes, only then go into the logic of the wildcard
    if (game.board[index].image_url.includes("golden-card-icon.svg")) {
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

      if (wildCardClicked) {
        alert("Yaay! You clicked the wildcard.");
      }

      setTimeout(() => {
        if (wildCardClicked === "both cards added") {
          const cardOne = game.board.findIndex(
            (e) => e.image_url === firstImageUrl
          );
          const cardTwo = game.board.findLastIndex(
            (e) => e.image_url === secondImageUrl
          );

          setFakeCardClicked(cardOne);
          setSecondFakeCardClicked(cardTwo);
        }
        if (wildCardClicked === "second card added") {
          const cardTwoo = game.board.findLastIndex(
            (e) => e.image_url === secondImageUrl
          );
          setSecondFakeCardClicked(cardTwoo);
        }
        setMatches(game.matches.length);

        setWildCardClicked(null);
      }, 1000);
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
    //Steph: Added minus 1 here in the calculation to not count the wildcard
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
                  handleWildCardClick={handleWildCardClick}
                  disableClicks={disableClicks}
                />
              );
            } else {
              return (
                <Card
                  //Steph: below two props added with Judith for the fake clicks of wildcard matches
                  fakeCardClicked={fakeCardClicked}
                  cardKey={index}
                  // plus one more prop after debugging
                  secondFakeCardClicked={secondFakeCardClicked}
                  key={index}
                  imgSrc={element.image_url}
                  text={text[index]}
                  board={game.board}
                  handleCardClickCallback={() => handleCardClickCallback(index)}
                  handleWildCardClick={handleWildCardClick}
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
