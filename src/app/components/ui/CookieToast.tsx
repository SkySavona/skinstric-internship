"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const CookieToast: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 6000); // Show after 6 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showToast && toastRef.current) {
      const mm = gsap.matchMedia();
  
      // Define different animations for different screen sizes
      mm.add("(min-width: 768px)", () => {
        // For larger screens (min-width: 768px)
        gsap.set(toastRef.current, {
          width: "0px",
          height: "1px",
          opacity: 1,
          display: "block",
        });
  
        gsap.to(toastRef.current, {
          width: "30vw",
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(toastRef.current, {
              height: "auto",
              duration: 0.6,
              ease: "power2.out",
            });
          },
        });
      });
  
      mm.add("(max-width: 767px)", () => {
        // For medium screens and below (max-width: 767px)
        gsap.set(toastRef.current, {
          width: "0px",
          height: "1px",
          opacity: 1,
          display: "block",
        });
  
        gsap.to(toastRef.current, {
          width: "50vw",
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(toastRef.current, {
              height: "auto",
              duration: 0.6,
              ease: "power2.out",
            });
          },
        });
      });
  
      // Cleanup the media query listeners on unmount
      return () => mm.revert();
    }
  }, [showToast]);
  

  const handleClose = () => {
    if (toastRef.current) {
      // First collapse vertically, then horizontally
      gsap.to(toastRef.current, {
        height: "1px",
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(toastRef.current, {
            width: "0px",
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => setShowToast(false),
          });
        },
      });
    }
  };

  if (!showToast) return null;

  return (
    <div
      ref={toastRef}
      className="app-message AppMessage_container__vV0YG CookiesAgreement_container___Pi1s AppMessage_fixed__qcwRf curtain-enter-done "
      style={{
        position: "fixed",
        top: "56px",
        right: "16px",
        backgroundColor: "#1a1b1c",
        color: "#fcfcfc",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 20,
        overflow: "hidden",
        display: "none",
        marginRight: "16px",
        width: "400px", // Default width
      }}
    >
      <div className="app-message__top AppMessage_top__SVYRx">
        We use cookies to provide the best experience
      </div>
      <div className="app-message__bottom AppMessage_bottom__5GoID">
        <button
          className="text-button btn Button_btn__wpFCD Button_btn-dark__QZyGW Button_uppercase__bZ3k_"
          data-hover="OK"
          onClick={handleClose}
        >
          <span className="btn-inner Button_btn-inner___9jC5">OK</span>
        </button>
      </div>
    </div>
  );
};

export default CookieToast;