import React, { useState, useEffect, useRef } from "react";

function ValueCard({
  bgClass = "bg-gray-500", // Default background class
  cardId,
  titleClass,
  valueClass,
  percentId,
  showToggle ,
  currencyCode = "₹", // Default currency code
  title1 = "Default Title", // Default title
  title2 = "Default Title", // Default title
  value1 = 0, // Default to 0 to prevent undefined
  value2 = 0, // Default to 0 to prevent undefined
  percentValue1 = 0, // Default percentage
  percentValue2 = 0, // Default percentage
  duration = 1000, // Animation duration
}) {
  const [isToggled, setIsToggled] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(title1);
  const valueRef = useRef(null);
  const percentageRef = useRef(null);

  useEffect(() => {
    const valueEl = valueRef.current;
    const percentageEl = percentageRef.current;
    if (!valueEl) return;

    // Set title, value, and percentage based on toggle state
    const targetTitle = isToggled ? title2 : title1;
    const targetValue = isToggled ? value2 : value1;
    const targetPercent = isToggled ? percentValue2 : percentValue1; // Fixed: Use percentValue2 when toggled

    setDisplayTitle(targetTitle);

    // Update percentage and apply styling
    if (percentageEl && targetPercent !== undefined) {
      percentageEl.textContent = `${targetPercent}%`;
      percentageEl.classList.toggle("text-red-600", targetPercent < 0);
      percentageEl.classList.toggle("text-green-600", targetPercent >= 0);
    }

    // Animation logic
    const startValue = parseInt(valueEl.textContent.replace(/,/g, "")) || 0;
    const delta = targetValue - startValue;
    const startTime = performance.now();
    let animationFrameId;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(startValue + delta * progress);

      valueEl.textContent = value.toLocaleString();

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      }
    }

    // Initialize textContent to 0 for animation on mount
    valueEl.textContent = "0";
    animationFrameId = requestAnimationFrame(update);

    // Cleanup animation
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isToggled, value1, value2, percentValue1, percentValue2, duration]);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  return (
    <div
      className={`${bgClass} h-40 rounded-xl shadow flex items-center justify-center p-4 hover:shadow-xl`}
      id={cardId}
    >
      <div className="h-full w-full flex flex-col">
        <div className="h-1/2 relative align-middle flex">
          <h4 className="text-white italic items-center">
            <span className={titleClass}>{displayTitle}</span>
          </h4>

          {showToggle && (
            <label className="inline-flex items-center cursor-pointer absolute top-0 right-0">
              <input
                type="checkbox"
                id={`${cardId.includes("monthly") ? "monthly" : cardId}-toggle`}
                className="sr-only peer"
                checked={isToggled}
                onChange={handleToggle}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-gray-400"></div>
            </label>
          )}
        </div>
        <div className="h-1/2 align-middle flex flex-row">
          <h1 className="text-white m-auto text-3xl font-bold font-sans mx-auto w-full">
            <span className="m-0">{currencyCode} </span>
            <span ref={valueRef} className={`number m-0 ${valueClass}`}>
              0 {/* Initialize to 0 for animation on mount */}
            </span>
          </h1>
          {percentId && (
            <h4
              ref={percentageRef}
              className="h-full font-bold italic"
              id={percentId}
            ></h4>
          )}
        </div>
      </div>
    </div>
  );
}

export default ValueCard;