import React, { useEffect, useState, useRef } from "react";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import axios from "axios";
import Preloader from "@/app/components/ui/Preloader"; 

const libraries: "places"[] = ["places"];

const IntroductionPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [labelText, setLabelText] = useState("CLICK TO TYPE");
  const [showLabel, setShowLabel] = useState(true);
  const [showLocationPlaceholder, setShowLocationPlaceholder] = useState(false);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    setIsClient(true);
    
    // Set a minimum loading time of 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Clear session storage on page reload
    if (performance.navigation.type === 1) {
      sessionStorage.clear();
    } else {
      const storedName = sessionStorage.getItem("userName");
      const storedLocation = sessionStorage.getItem("userLocation");
      if (storedName) {
        setName(storedName);
        setShowLabel(false);
      }
      if (storedLocation) {
        setLocation(storedLocation);
        setShowLabel(false);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const handleNextStep = () => {
    if (name.trim()) {
      setStep(2);
      setLabelText("CLICK TO TYPE");
      setShowLabel(!location);
      setShowLocationPlaceholder(false);
      sessionStorage.setItem("userName", name);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setLabelText("CLICK TO TYPE");
      setShowLabel(!name);
      setShowLocationPlaceholder(false);
    }
  };

  const handlePlaceSelect = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const newLocation = places[0].formatted_address || "";
      setLocation(newLocation);
      sessionStorage.setItem("userLocation", newLocation);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && name.trim()) {
      handleNextStep();
    } else if (step === 2 && location.trim()) {
      try {
        const response = await axios.post("/api/submit", { name, location });
        // Handle successful submission here
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle error here
        }
      }
    }
  };

  const handleInputClick = () => {
    setShowLabel(false);
    if (step === 1) {
      setLabelText("INTRODUCE YOURSELF");
    } else if (step === 2) {
      setLabelText("WHERE ARE YOU FROM?");
      setShowLocationPlaceholder(true);
    }
  };

  const handleInputBlur = () => {
    const currentValue = step === 1 ? name : location;
    if (!currentValue.trim()) {
      setLabelText("CLICK TO TYPE");
      setShowLabel(true);
      if (step === 2) {
        setShowLocationPlaceholder(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        handleInputBlur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [step, name, location]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  if (!isClient || !isLoaded || isLoading) {
    return <Preloader />;
  }

  return (
    <main className="main" style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="header wrapper js-header Header_header__DR57N">
        <div className="Header_left__S1crO">
          <a className="text-button Header_logo___mrgN" href="/" style={{ clipPath: "inset(0%)" }}>
            Skinstric
          </a>
        </div>
        <div className="Header_right__4jKrY"></div>
      </header>
      <div className="page wrapper" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="text-transition-container introduction-title-container">
          <h1 className="introduction-title js-introduction-title">To start analysis</h1>
        </div>
        <div className="introduction-square js-introduction-square">
          <span className="dotted-square is-animated"></span>
        </div>
        <div className="testing-introduction" style={{ "--introduction-form-label-symbols": "18" } as React.CSSProperties}>
          <div className="text-caption testing-introduction__label js-introduction-form-label">{labelText}</div>
          <form className="js-introduction-form" onSubmit={handleSubmit}>
            <div className="input-group Input_group__j1RLm testing-introduction__input" ref={inputRef}>
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
                />
              ) : (
                <StandaloneSearchBox onLoad={(ref) => (searchBoxRef.current = ref)} onPlacesChanged={handlePlaceSelect}>
                  <input
                    id="introduction-form__input"
                    className="form-control Input_input__mhRiw bg-transparent"
                    data-testid="input-el"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={showLocationPlaceholder ? "Enter a location" : ""}
                    onClick={handleInputClick}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    style={{ color: location ? "inherit" : "#999" }}
                  />
                </StandaloneSearchBox>
              )}
              {showLabel && (
                <label htmlFor="introduction-form__input" className="input-label Input_label__oBKpG">
                  {step === 1 ? "Introduce yourself" : "Where are you from?"}
                </label>
              )}
              <div className="input-message Input_message__tFwwD" aria-live="polite" aria-describedby="introduction-form__input"></div>
            </div>
          </form>
        </div>
        <div className="BottomNav_container___bFFU" style={{ marginTop: "auto" }}>
          <div className="BottomNav_left__ApQ4i">
            <button className="text-button IconButton_btn__g_osN IconButton_btn-horizontal__SD5o9 IconButton_btn--icon-left__b3LBo js-introduction-left-bottom-link" onClick={handlePreviousStep}>
              <span className="icon-btn__icon IconButton_btn-icon__nh18G">
                <span className="icon-btn__icon-inner IconButton_btn-icon-inner__ieeSs">
                  <svg width="11" height="12" viewBox="0 0 11 12" fill="#1A1B1C" xmlns="http://www.w3.org/2000/svg" role="img" style={{ position: "relative", top: 1, left: -1 }}>
                    <path d="m.714 6 9.429 5.444V.556L.714 6Z" fill="current"></path>
                  </svg>
                </span>
              </span>
              <span className="icon-btn__text IconButton_btn-text__KTP0Q">Back</span>
            </button>
          </div>
          <div className="BottomNav_right__Ulf7C">
            {((step === 1 && name.trim()) || (step === 2 && location.trim())) && (
              <button className="text-button IconButton_btn__g_osN IconButton_btn-horizontal__SD5o9 IconButton_btn--icon-right__z4uOK js-introduction-right-bottom-link" onClick={handleSubmit}>
                <span className="icon-btn__icon IconButton_btn-icon__nh18G">
                  <span className="icon-btn__icon-inner IconButton_btn-icon-inner__ieeSs">
                    <svg width="11" height="12" viewBox="0 0 11 12" fill="#1A1B1C" xmlns="http://www.w3.org/2000/svg" role="img" style={{ position: "relative", top: -1, left: 1 }}>
                      <path d="M10.145 6 .716 11.444V.556L10.145 6Z" fill="current"></path>
                    </svg>
                  </span>
                </span>
                <span className="icon-btn__text IconButton_btn-text__KTP0Q">Proceed</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default IntroductionPage;