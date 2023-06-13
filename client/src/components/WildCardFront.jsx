import React from "react";

function WildCardFront({ text, imgSrc }) {
  return (
    <div className="front wildcard">
      <img className="wild-card-image" src={imgSrc} alt={text} />
      {/*  <p className="card-text">{text}</p> */}{" "}
      {/* Step: decided to leave the Wildcard text out because it made styling and the card look a bit weird */}
    </div>
  );
}

export default WildCardFront;
