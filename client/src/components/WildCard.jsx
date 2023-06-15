import React, { useState, useEffect } from "react";
import "./Card.css";
import WildCardFront from "./WildCardFront";
import CardBack from "./CardBack";

// Data
import { Animals } from "./animals";

function Card({
  handleCardClickCallback,
  disableClicks,
  isMatch,
  board,
  cardsClicked,
}) {
  const [isCardFlipped, setCardFlipped] = useState(false);
  const [backImageUrl, setBackImageUrl] = useState(
    Animals[Math.floor(Math.random() * Animals.length)].image_url
  );

  const handleCardClick = () => {
    if (disableClicks) return; // Return early if clicks are disabled

    setCardFlipped(true);
    handleCardClickCallback();
  };

  useEffect(() => {
    if (isCardFlipped) {
      // wild-card-logic here
      console.log("wildcard flipped!");
      // work with this.matches from matchingGame.js and then do something like this: !game.match.includes(element.url) to know which cards to EXCLUDE from the list of cards that the wildcard will use
      // then I want to pass either of these props and grab the array here to then pick one item OR one item plus its match to then send the index/indices to the handleCardClickCallback in GameBoard.jsx
      // because, depending on one the wildcard is clicked (as first or second item), I want the following:
      /* 
      1. If I clicked just the wildcard and no first card before that:
      -> I want to set the first key in the cardsClicked-hook to null
      -> Then filter through game.board for where this applies: !game.match.includes(element.url) and find(it's a method that returns the first item to which set parameters apply) just the first item in the list
      -> Then find its matching ID partner (it must have a different index!!) and send both those indices (one after the other) to the handleClickCallback in the GameBoard.jsx file
      2. If a card has been previously clicked before the wildcard
      -> I want to set the cardsClicked-hook's second item to null immediately before anything else happens
      -> Then I want to check the ID of the first card and look for the matching ID in the game.board - again, I must search for the same ID with a different index!!!
      -> Then this time just send the second card to the handleClickCallback function on the GameBoard
      */
    }
  }, [isCardFlipped]);

  return (
    <div className="cards" onClick={handleCardClick}>
      {isCardFlipped ? (
        <WildCardFront
          text="WildCard"
          imgSrc="https://cdn.bfldr.com/Z0BJ31FP/at/vjc7chngjc36vgpxmr3fhm7x/golden-card-icon.svg"
        />
      ) : (
        <CardBack backImageUrl={backImageUrl} />
      )}
    </div>
  );
}

export default Card;
