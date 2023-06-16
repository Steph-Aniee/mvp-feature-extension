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
  setCardsClicked,
  handleWildCardClick,
}) {
  const [isCardFlipped, setCardFlipped] = useState(false);
  const [backImageUrl, setBackImageUrl] = useState(
    Animals[Math.floor(Math.random() * Animals.length)].image_url
  );

  const handleCardClick = () => {
    if (disableClicks) return; // Return early if clicks are disabled

    setCardFlipped(true);
  };

  useEffect(() => {
    if (isCardFlipped) {
      console.log("wildcard flipped!");
      handleCardClickCallback();
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
