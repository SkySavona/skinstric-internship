"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import axios from "axios";
import { gsap } from "gsap";
import { useRouter } from 'next/navigation';
import Header from "../components/layout/Header";

const Preloader = React.lazy(() => import("@/app/components/ui/Preloader"));

// Define the libraries array for Google Maps API
const libraries: "places"[] = ["places"];

const IntroductionPage: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [labelText, setLabelText] = useState("CLICK TO TYPE");
  const [showLabel, setShowLabel] = useState(true);
  const [showLocationPlaceholder, setShowLocationPlaceholder] = useState(false);
  const [error, setError] = useState("");
  const [isValidLocation, setIsValidLocation] = useState(false);
  const [businessAddressError, setBusinessAddressError] = useState("");

  // Ref declarations
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const proceedButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  // Load Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // Initial setup effect
  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Clear session storage on page refresh
    if (performance.navigation.type === 1) {
      sessionStorage.clear();
    } else {
      // Retrieve stored data if available
      const storedName = sessionStorage.getItem("userName");
      const storedLocation = sessionStorage.getItem("userLocation");
      if (storedName) {
        setName(storedName);
        setShowLabel(false);
      }
      if (storedLocation) {
        setLocation(storedLocation);
        setShowLabel(false);
        setIsValidLocation(true);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  // Animation effect using GSAP
  useEffect(() => {
    if (!isLoading) {
      const timeline = gsap.timeline({
        defaults: { duration: 1, ease: "power3.out" },
      });

      // Animate title
      if (titleRef.current) {
        timeline.fromTo(titleRef.current, { yPercent: 100 }, { yPercent: 0 });
      }

      // Animate form elements
      const formElements: HTMLElement[] = [];
      if (formRef.current) formElements.push(formRef.current);
      if (labelRef.current) formElements.push(labelRef.current);

      if (formElements.length > 0) {
        timeline.fromTo(
          formElements,
          { clipPath: "inset(0% 50% 0% 50%)" },
          { clipPath: "inset(0% 0% 0% 0%)" },
          0
        );
      }

      // Animate buttons
      const buttonsToAnimate: HTMLElement[] = [];
      if (proceedButtonRef.current)
        buttonsToAnimate.push(proceedButtonRef.current);
      if (backButtonRef.current) buttonsToAnimate.push(backButtonRef.current);

      if (buttonsToAnimate.length > 0) {
        timeline.fromTo(
          buttonsToAnimate,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0 },
          0
        );
      }
    }
  }, [isLoading]);

  // Handle progression to next step
  const handleNextStep = () => {
    if (name.trim()) {
      setStep(2);
      setLabelText("CLICK TO TYPE");
      setShowLabel(!location);
      setShowLocationPlaceholder(false);
      sessionStorage.setItem("userName", name);
      setError("");
    } else {
      setError("Please enter your name");
    }
  };

  // Handle going back to previous step
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setLabelText("CLICK TO TYPE");
      setShowLabel(!name);
      setShowLocationPlaceholder(false);
      setError("");
      setBusinessAddressError("");
    }
  };

  // Handle place selection from Google Maps API
  const handlePlaceSelect = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const newLocation = place.formatted_address || "";

      // Exclude business or non-residential types
      const businessTypes = [
        "establishment",
        "point_of_interest",
        "store",
        "restaurant",
        "local_business",
        "lodging",
        "school",
        "church",
        "hospital",
        "shopping_mall",
        "bar",
        "cafe",
        "tourist_attraction",
        "night_club",
      ];

      // Check if the selected place is categorized as a business or other non-residential type
      const isBusinessAddress = place.types?.some((type) =>
        businessTypes.includes(type)
      );

      if (isBusinessAddress) {
        setBusinessAddressError(
          "Please enter a residential address, not a business or commercial address."
        );
        setIsValidLocation(false);
        setLocation("");
      } else {
        setLocation(newLocation);
        setIsValidLocation(true);
        sessionStorage.setItem("userLocation", newLocation);
        setError("");
        setBusinessAddressError("");
      }
    } else {
      setIsValidLocation(false);
      setError("Please select a valid location.");
      setBusinessAddressError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && location.trim() && isValidLocation) {
      try {
        await axios.post("/api/submit", { name, location });
        
        // Reset form state after successful submission
        setName("");
        setLocation("");
        setStep(1);
        setError("");
        setIsValidLocation(false);

        // Redirect to TestingPage after successful form submission
        router.push('/testing');  // Assuming 'testing' is the correct route
      } catch (error) {
        setError("An error occurred while submitting the form. Please try again.");
      }
    } else {
      setError(
        step === 1 ? "Please enter your name" : "Please enter a valid location"
      );
    }
  };

  // Handle input field click
  const handleInputClick = () => {
    setShowLabel(false);
    if (step === 1) {
      setLabelText("INTRODUCE YOURSELF");
    } else if (step === 2) {
      setLabelText("WHERE ARE YOU FROM?");
      setShowLocationPlaceholder(true);
    }
    setError("");
    setBusinessAddressError("");
  };

  // Handle input field blur
  const handleInputBlur = useCallback(() => {
    const currentValue = step === 1 ? name : location;
    if (!currentValue.trim()) {
      setLabelText("CLICK TO TYPE");
      setShowLabel(true);
      if (step === 2) {
        setShowLocationPlaceholder(false);
      }
    }
  }, [step, name, location]);

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setIsValidLocation(false);
    setBusinessAddressError("");
  };

  // Effect to handle clicks outside the input field
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleInputBlur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleInputBlur]);

  // Handle key press (for Enter key submission)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  // Render loading state
  if (!isClient || !isLoaded || isLoading) {
    return (
      <React.Suspense fallback={<div></div>}>
        <Preloader />
      </React.Suspense>
    );
  }

  // Main component render
  return (
    <main
      className="main"
      style={{
        position: "relative",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
       
      }}
    >
      {/* Header component */}
      <Header />

      {/* Main content */}
      <div
      
        className="page wrapper"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          
        }}
      >
        {/* Title */}
        <div className="text-transition-container introduction-title-container">
          <h1
            className="introduction-title js-introduction-title"
            ref={titleRef}
          >
            To start analysis
          </h1>
        </div>

        {/* Animated square */}
        <div className="introduction-square js-introduction-square">
          <span className="dotted-square is-animated"></span>
        </div>

        {/* Form section */}
        <div
          className="testing-introduction"
          style={
            { "--introduction-form-label-symbols": "21" } as React.CSSProperties
          }
        >
          {/* Label */}
          <div
            className="text-caption testing-introduction__label js-introduction-form-label"
            ref={labelRef}
          >
            {labelText}
          </div>

          {/* Form */}
          <form
            className="js-introduction-form "
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <div
              className="input-group Input_group__j1RLm testing-introduction__input "
              ref={inputRef}
            >
              {/* Conditional rendering based on step */}
              {step === 1 ? (
                <input
                  id="introduction-form__input"
                  className="form-control Input_input__mhRiw bg-transparent"
                  data-testid="input-el"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onClick={handleInputClick}
                  onBlur={handleInputBlur}
                  onKeyPress={handleKeyPress}
                  aria-label="Enter your name"
                  required
                />
              ) : (
                <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={handlePlaceSelect}
                >
                  <input
                    id="introduction-form__input"
                    className="form-control Input_input__mhRiw bg-transparent px-0"
                    data-testid="input-el"
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    placeholder={
                      showLocationPlaceholder ? "Enter a location" : ""
                    }
                    onClick={handleInputClick}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    style={{ color: location ? "inherit" : "#999" }}
                    aria-label="Enter your location"
                    required
                  />
                </StandaloneSearchBox>
              )}

              {/* Show label conditionally */}
              {showLabel && (
                <label
                  htmlFor="introduction-form__input"
                  className="input-label Input_label__oBKpG w-full whitespace-nowrap overflow-hidden"
                >
                  <span className="inline-block min-w-full">
                    {step === 1 ? "Introduce yourself" : "Where are you from?"}
                  </span>
                </label>
              )}

              {/* Error message display */}
              <div
                className="input-message Input_message__tFwwD"
                aria-live="polite"
                aria-describedby="introduction-form__input"
              >
                {error && <span className="error-message">{error}</span>}
                {businessAddressError && (
                  <span className="error-message">{businessAddressError}</span>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Navigation buttons */}
        <div
          className="BottomNav_container___bFFU"
          style={{ marginTop: "auto" }}
        >
          <div className="BottomNav_left__ApQ4i">
            {/* Back button */}
            <button
              className="text-button IconButton_btn__g_osN IconButton_btn-horizontal__SD5o9 IconButton_btn--icon-left__b3LBo js-introduction-left-bottom-link"
              onClick={handlePreviousStep}
              ref={backButtonRef}
              aria-label="Go back"
            >
              <span className="icon-btn__icon IconButton_btn-icon__nh18G">
                <span className="icon-btn__icon-inner IconButton_btn-icon-inner__ieeSs">
                  <svg
                    width="11"
                    height="12"
                    viewBox="0 0 11 12"
                    fill="#1A1B1C"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    style={{ position: "relative", top: 1, left: -1 }}
                  >
                    <path
                      d="m.714 6 9.429 5.444V.556L.714 6Z"
                      fill="current"
                    ></path>
                  </svg>
                </span>
              </span>
              <span className="icon-btn__text IconButton_btn-text__KTP0Q">
                Back
              </span>
            </button>
          </div>
          <div className="BottomNav_right__Ulf7C">
            {/* Proceed button (conditionally rendered) */}
            {((step === 1 && name.trim()) ||
              (step === 2 && location.trim() && isValidLocation)) && (
              <button
                className="text-button IconButton_btn__g_osN IconButton_btn-horizontal__SD5o9 IconButton_btn--icon-right__z4uOK js-introduction-right-bottom-link"
                onClick={handleSubmit}
                ref={proceedButtonRef}
                aria-label="Proceed to next step"
              >
                <span className="icon-btn__icon IconButton_btn-icon__nh18G">
                  <span className="icon-btn__icon-inner IconButton_btn-icon-inner__ieeSs">
                    <svg
                      width="11"
                      height="12"
                      viewBox="0 0 11 12"
                      fill="#1A1B1C"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      style={{ position: "relative", top: -1, left: 1 }}
                    >
                      <path
                        d="M10.145 6 .716 11.444V.556L10.145 6Z"
                        fill="current"
                      ></path>
                    </svg>
                  </span>
                </span>
                <span className="icon-btn__text IconButton_btn-text__KTP0Q">
                  Proceed
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default IntroductionPage;
