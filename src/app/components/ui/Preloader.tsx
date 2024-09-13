"use client"

import React, { useEffect, useState } from 'react';

const Preloader: React.FC = () => {
  // State to control animation and visibility
  const [isAnimated, setIsAnimated] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Start animation after 1 second
    const timeout = setTimeout(() => {
      setIsAnimated(true);
    }, 1000);

    // Hide the preloader after 5 seconds
    const hideTimeout = setTimeout(() => {
      setIsHidden(true);
    }, 5000);

    // Cleanup function to clear timeouts
    return () => {
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // If hidden, render nothing
  if (isHidden) return null;

  return (
    <div
      className={`Preloader_container__THScV ${
        isAnimated ? 'Preloader_is-animated__jMYah' : ''
      } ${isHidden ? 'Preloader_is-hidden__v1eA_' : ''}`}
    >
      {/* Main dotted square */}
      <span className="dotted-square Preloader_square__wXGLa"></span>

      {/* First masked square */}
      <div
        className={`Preloader_square-mask__u19rM Preloader_square-mask-1__2HoNq ${
          isAnimated ? 'Preloader_is-animated__jMYah' : ''
        }`}
      >
        <div className="Preloader_square-mask-inner__tSpgZ"></div>
      </div>

      {/* Second dotted square with scale */}
      <span className="dotted-square Preloader_square__wXGLa scale-1-1"></span>

      {/* Second masked square */}
      <div
        className={`Preloader_square-mask__u19rM Preloader_square-mask-2__XxEYG ${
          isAnimated ? 'Preloader_is-animated__jMYah' : ''
        }`}
      >
        <div className="Preloader_square-mask-inner__tSpgZ"></div>
      </div>

      {/* Third dotted square with different scale */}
      <span className="dotted-square Preloader_square__wXGLa scale-1-2"></span>

      {/* Third masked square */}
      <div
        className={`Preloader_square-mask__u19rM Preloader_square-mask-3__1wG5z ${
          isAnimated ? 'Preloader_is-animated__jMYah' : ''
        }`}
      >
        <div className="Preloader_square-mask-inner__tSpgZ"></div>
      </div>
    </div>
  );
};

export default Preloader;