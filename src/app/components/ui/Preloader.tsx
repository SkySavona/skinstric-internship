import React, { useEffect, useState } from 'react';

const Preloader: React.FC = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimated(true);
    }, 1000);

    const hideTimeout = setTimeout(() => {
      setIsHidden(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={`Preloader_container__THScV ${
        isAnimated ? 'Preloader_is-animated__jMYah' : ''
      } ${isHidden ? 'Preloader_is-hidden__v1eA_' : ''}`}
    >
      {/* Dotted square behind mask 1 */}
      <span className="dotted-square Preloader_square__wXGLa"></span>

      <div
        className={`Preloader_square-mask__u19rM Preloader_square-mask-1__2HoNq ${
          isAnimated ? 'Preloader_is-animated__jMYah' : ''
        }`}
      >
        <div className="Preloader_square-mask-inner__tSpgZ"></div>
      </div>

      {/* Dotted square behind mask 2 */}
      <span className="dotted-square Preloader_square__wXGLa scale-1-1"></span>

      <div
        className={`Preloader_square-mask__u19rM Preloader_square-mask-2__XxEYG ${
          isAnimated ? 'Preloader_is-animated__jMYah' : ''
        }`}
      >
        <div className="Preloader_square-mask-inner__tSpgZ"></div>
      </div>

      {/* Dotted square behind mask 3 */}
      <span className="dotted-square Preloader_square__wXGLa scale-1-2"></span>

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
