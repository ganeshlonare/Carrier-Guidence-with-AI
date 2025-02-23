"use client"; // Required for Next.js to use client-side features

import { useState, useEffect } from "react";

const MemoryGame = () => {
  // Step 1: Define the cards array
  const cardsArray = [
    { name: "CSS", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7G5O3uCswwuJ0lvtIjBXNTVBcKZzs4ZFFLA&s" },
    { name: "HTML", img: "https://e7.pngegg.com/pngimages/780/934/png-clipart-html-logo-html5-logo-icons-logos-emojis-tech-companies-thumbnail.png" },
    { name: "jQuery", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmLME0hpAJOqBGhaVjcgkk8hIKS3S4GAqrLg&s" },
    { name: "JS", img: "https://e7.pngegg.com/pngimages/793/545/png-clipart-javascript-logo-computer-icons-vue-js-angle-text-thumbnail.png" },
    { name: "Node", img: "https://e7.pngegg.com/pngimages/306/37/png-clipart-node-js-logo-node-js-javascript-web-application-express-js-computer-software-others-miscellaneous-text-thumbnail.png" },
    { name: "Python", img: "https://img.icons8.com/color/512/python.png" },
  ];

  // Step 2: Duplicate and shuffle the cards
  const [shuffledCards, setShuffledCards] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [matchedCards, setMatchedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  useEffect(() => {
    const duplicatedCards = [...cardsArray, ...cardsArray];
    const shuffled = duplicatedCards.sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, []);

  // Step 3: Handle card clicks
  const handleCardClick = (index) => {
    if (flippedCards.includes(index) || matchedCards.includes(shuffledCards[index].name)) {
      return; // Prevent flipping already matched or flipped cards
    }

    if (clickCount === 0) {
      setFirstCard(index);
      setFlippedCards((prev) => [...prev, index]);
      setClickCount(1);
    } else if (clickCount === 1 && index !== firstCard) {
      setSecondCard(index);
      setFlippedCards((prev) => [...prev, index]);
      setClickCount(2);
    }
  };

  // Step 4: Check for matches
  useEffect(() => {
    if (clickCount === 2) {
      const firstCardName = shuffledCards[firstCard]?.name;
      const secondCardName = shuffledCards[secondCard]?.name;

      if (firstCardName === secondCardName) {
        setMatchedCards((prev) => [...prev, firstCardName]);
      }

      setTimeout(() => {
        setFlippedCards([]);
        setFirstCard(null);
        setSecondCard(null);
        setClickCount(0);
      }, 1000);
    }
  }, [clickCount, firstCard, secondCard, shuffledCards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-12 p-8">
      <h1 className="text-4xl font-bold">
        Match The <span className="text-white">Images</span>
      </h1>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shuffledCards.map((card, index) => (
          <div
            key={index}
            className={`relative w-24 h-24 md:w-32 md:h-32 cursor-pointer transition-transform duration-500 ${
              flippedCards.includes(index) || matchedCards.includes(card.name)
                ? "rotate-y-180"
                : ""
            }`}
            onClick={() => handleCardClick(index)}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of the card (black) */}
            <div
              className="absolute w-full h-full bg-black rounded-lg shadow-lg flex items-center justify-center"
              style={{ backfaceVisibility: "hidden" }}
            ></div>
            {/* Back of the card (white with image) */}
            <div
              className="absolute w-full h-full bg-white rounded-lg shadow-lg flex items-center justify-center transform rotate-y-180"
              style={{
                backfaceVisibility: "hidden",
                backgroundImage: `url(${card.img})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MemoryGame;