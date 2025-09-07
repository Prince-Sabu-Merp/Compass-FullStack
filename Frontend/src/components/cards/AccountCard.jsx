import React, { useState, useEffect } from "react";
import CardChip from "/ATM_Card_Chip.png";

// Main application component that renders the ATM card.
function AccountCard(props) {
  // State to track if the card is flipped.
  const [isFlipped, setIsFlipped] = useState(false);
  // State to control the start animation.
  const [isMounted, setIsMounted] = useState(false);

  // Use useEffect to trigger the animation after the component mounts.
  useEffect(() => {
    // Set isMounted to true on component mount to start the animation.
    setIsMounted(true);
  }, []);

  // Define an array of Tailwind CSS gradient classes.
  const cardGradients = [
    "from-purple-800 via-indigo-900 to-black",
    "from-rose-800 via-pink-900 to-black",
    "from-emerald-800 via-teal-900 to-black",
    "from-orange-800 via-red-900 to-black",
    "from-blue-800 via-sky-900 to-black",
  ];

  // Define an array of Tailwind CSS classes for different background styles/directions.
  const backgroundStyles = [
    "bg-gradient-to-br",
    "bg-gradient-to-tr",
    "bg-gradient-to-bl",
    "bg-gradient-to-tl",
  ];

  // Use a number prop to select the gradient and style.
  // The modulo operator (%) ensures the index stays within the array bounds.
  const gradientIndex = props.CardNumber % cardGradients.length;
  const styleIndex = props.CardNumber % backgroundStyles.length;

  const cardGradient = cardGradients[gradientIndex];
  const backgroundStyle = backgroundStyles[styleIndex];

  // Combine the selected background style and color gradient into a single class string.
  const backgroundClass = `${backgroundStyle} ${cardGradient}`;

  // Function to toggle the flip state.
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    // Card container with perspective and click handler.
    <div
      onClick={handleFlip}
      className={`relative w-full min-w-[300px] max-w-[400px] aspect-[1.6/1] cursor-pointer `}
      style={{ perspective: "1000px" }}
    >
      {/* Inner container that rotates */}
      <div
        className={`relative w-full h-full text-gray-100 rounded-2xl  hover:shadow-xl transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Card Front */}
        <div
          className={`absolute w-full h-full [backface-visibility:hidden] rounded-2xl p-5 border border-gray-700/50 flex flex-col justify-between ${backgroundClass}`}
        >
          {/* Top section with logo */}
          <div className="flex justify-between items-start flex-row">
            <div className="text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
              {props.AccountName}
            </div>
            <div className=" h-9 overflow-hidden">
              <img
                className="w-full h-full rounded-xs"
                src={props.AccountLogo}
                alt=""
              />
            </div>
          </div>

          {/* Card number section */}
          <div>
            <div className="text-xl font-stretch-expanded font-mono tracking-wider  text-gray-200">
              {props.AccountNumber}

              <img className="h-9 mb-3" src={CardChip} alt="" />
            </div>

            {/* Bottom section with name and type */}
            <div className="flex justify-between items-end mt-auto pt-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 tracking-wide">
                  Account Owner
                </span>
                <span className="text-md font-mono font-bold uppercase text-gray-100 mb-5">
                  {props.AccountHolderName}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 tracking-wide"></span>
                <span className="text-md font-medium text-gray-100 italic">
                  {props.AccountType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Back */}
        <div
          className={`absolute w-full h-full [backface-visibility:hidden] rounded-2xl p-5 border border-gray-700/50 rotate-y-180 flex flex-col justify-between ${backgroundClass}`}
        >
          {/* Magnetic stripe */}

          <div className="my-4">
            <h4 className="m-0 pr-2 pl-2">Balance:</h4>
            <div className="w-full h-12 bg-gray-800 rounded-md flex items-center pr-4 pl-4">
              <h2 className="text-3xl font-bold text-gray-100 font-sans">
                {props.CurrencySymbol} {props.Balance}
              </h2>
            </div>
          </div>

          {/* Signature field and CVV */}
          <div className="flex flex-col items-end">
            <div className="w-full h-8 bg-gray-200 rounded-md flex justify-center items-center"></div>
            <div className="text-xs text-gray-400 mt-2">
              <span className="font-bold">CVV:</span>
              <span className="text-sm font-mono ml-2 text-gray-100">
                {props.CVV}
              </span>
            </div>
          </div>

          {/* Additional details on the back */}
          <div className="mt-auto text-xs text-gray-400">
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountCard;
