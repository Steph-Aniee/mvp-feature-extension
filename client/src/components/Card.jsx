import React, { useState, useEffect } from "react";
import "./Card.css";
import CardFront from "./CardFront";
import CardBack from "./CardBack";

// Data
import { Animals } from "./animals";

function Card({
  imgSrc,
  text,
  handleCardClickCallback,
  isMatch,
  disableClicks,
  cardKey,
  fakeCardClicked,
  secondFakeCardClicked,
}) {
  const [isCardTurned, setCardTurned] = useState(false);
  const [matchedFound, setMatchedFound] = useState(false);
  const [backImageUrl, setBackImageUrl] = useState(
    Animals[Math.floor(Math.random() * Animals.length)].image_url
  );

  const handleCardClick = (index) => {
    if (disableClicks) return; // Return early if clicks are disabled

    setCardTurned(true);
    handleCardClickCallback(index);
  };

  useEffect(() => {
    if (fakeCardClicked === cardKey) {
      setCardTurned(true);
    }

    if (secondFakeCardClicked === cardKey) {
      setCardTurned(true);
    }
  });

  useEffect(() => {
    if (matchedFound === true) {
      return;
    }

    if (isCardTurned) {
      if (isMatch === "not a match") {
        setTimeout(() => {
          setCardTurned(false);
        }, 2000);
      } else if (isMatch === "match") {
        setMatchedFound(true);
      }
    }
  }, [isCardTurned, isMatch]);

  return (
    <div className="cards" onClick={handleCardClick}>
      {isCardTurned ? (
        <CardFront text={text} imgSrc={imgSrc} />
      ) : (
        <CardBack backImageUrl={backImageUrl} />
      )}
    </div>
  );
}

export default Card;
