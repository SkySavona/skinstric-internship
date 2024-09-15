"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/app/components/layout/Header"; 
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import Image from "next/image";

const DemographicsPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("race");

  const backButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Retrieve API response from sessionStorage
    const storedApiResponse = sessionStorage.getItem("apiResponse");
    if (storedApiResponse) {
      setApiResponse(JSON.parse(storedApiResponse));
    } else {
      // If no API response, redirect back to testing page
      router.push("/testing");
    }

    return () => clearTimeout(timer);
  }, [router]);

  // GSAP animations
  useEffect(() => {
    if (!isLoading) {
      const timeline = gsap.timeline({
        defaults: { duration: 1, ease: "power3.out" },
      });

      // Animate elements
      if (titleRef.current) {
        timeline.fromTo(
          titleRef.current,
          { yPercent: 100 },
          { yPercent: 0 }
        );
      }
      if (subTitleRef.current) {
        timeline.fromTo(
          subTitleRef.current,
          { yPercent: 100 },
          { yPercent: 0 },
          "-=0.8"
        );
      }
      if (descriptionRef.current) {
        timeline.fromTo(
          descriptionRef.current,
          { yPercent: 100 },
          { yPercent: 0 },
          "-=0.8"
        );
      }

      // Animate buttons
      const buttonsToAnimate: HTMLElement[] = [];
      if (confirmButtonRef.current)
        buttonsToAnimate.push(confirmButtonRef.current);
      if (resetButtonRef.current)
        buttonsToAnimate.push(resetButtonRef.current);
      if (backButtonRef.current) buttonsToAnimate.push(backButtonRef.current);

      if (buttonsToAnimate.length > 0) {
        timeline.fromTo(
          buttonsToAnimate,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.8"
        );
      }
    }
  }, [isLoading]);

  const handleGoBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    // Proceed to the next step
    router.push("/analysis/skin-conditions"); // Adjust the route as needed
  };

  const handleReset = () => {
    // Reset selections to default
    setSelectedTab("race");
    // Add additional reset logic if needed
  };

  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="LoadingScreen_screen__RwPOB">
        <div className="LoadingScreen_square-wrapper__CBirV">
          <span className="dotted-square LoadingScreen_square__3vC1I is-expanded is-animated"></span>
        </div>
        <div className="subhead LoadingScreen_text__WLug7">
          LOADING YOUR DEMOGRAPHICS...
        </div>
      </div>
    );
  }

  // If apiResponse is null, return null (should not happen if redirected properly)
  if (!apiResponse) {
    return null;
  }

  // Extract data from apiResponse
  const { race, age, gender } = apiResponse; // Adjust according to the actual response structure

  // Placeholder data if apiResponse doesn't have the expected format
  const raceData = race || {
    predicted: "Black",
    confidence: 99.51,
    confidences: [
      { label: "Black", value: 99.51 },
      { label: "Southeast Asian", value: 0.36 },
      { label: "Latino Hispanic", value: 0.07 },
      { label: "South Asian", value: 0.04 },
      { label: "East Asian", value: 0.02 },
      { label: "Middle Eastern", value: 0.0 },
      { label: "White", value: 0.0 },
    ],
  };

  const ageData = age || {
    predicted: "20-29",
    confidence: 49,
    confidences: [
      { label: "20-29", value: 49 },
      { label: "30-39", value: 30 },
      // Add more age ranges as needed
    ],
  };

  const genderData = gender || {
    predicted: "Female",
    confidence: 72,
    confidences: [
      { label: "Female", value: 72 },
      { label: "Male", value: 28 },
    ],
  };

  const selectedData =
    selectedTab === "race"
      ? raceData
      : selectedTab === "age"
      ? ageData
      : genderData;

  return (
    <main className="main" style={{ position: "relative", zIndex: "inherit" }}>
      <Header />
      <div className="page wrapper">
        <div className="header-padding-container"></div>
        <div className="analysis-inner-top">
          {/* Back Button */}
          <div className="analysis-inner-top__back-btn-wrapper">
            <div className="analysis-inner-back-btn-wrapper analysis-inner-clip-wrapper">
              <button onClick={handleGoBack} ref={backButtonRef}>
                <span className="text-button IconButton_btn__g_osN IconButton_btn-horizontal__SD5o9 IconButton_btn--icon-left__b3LBo">
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
                </span>
              </button>
            </div>
          </div>
          {/* Title */}
          <div
            className="text-transition-container analysis-inner-clip-wrapper"
            ref={titleRef}
          >
            <div className="introduction-title js-analysis-inner-clip">
              A. I. Analysis
            </div>
          </div>
          {/* Subtitle */}
          <div
            className="text-transition-container analysis-inner-clip-wrapper"
            ref={subTitleRef}
          >
            <h1 className="h2 text-uppercase analysis-inner-title js-analysis-inner-clip">
              Demographics
            </h1>
          </div>
          <div
            className="text-transition-container analysis-inner-clip-wrapper"
            ref={descriptionRef}
          >
            <p className="text-caption introduction-description js-analysis-inner-clip">
              Predicted Race &amp; Age
            </p>
          </div>
        </div>
        {/* Content */}
        <div className="analysis-inner-content">
          <div className="demographics-container" data-rttabs="true">
            <div className="demographics-left">
              <ul className="list-unstyled" role="tablist">
                {/* Race */}
                <li
                  className={`demographics-pick-button ${
                    selectedTab === "race" ? "react-tabs__tab--selected" : ""
                  }`}
                  role="tab"
                  onClick={() => handleTabSelect("race")}
                >
                  <button
                    className={`subhead anaylsis-pick-button ${
                      selectedTab === "race" ? "anaylsis-pick-active" : ""
                    }`}
                  >
                    <span className="anaylsis-pick-line">
                      <span className="anaylsis-pick-title">
                        {raceData.predicted}
                      </span>
                      <span className="anaylsis-pick-category">Race</span>
                    </span>
                    <span className="demographics-pick-button-diagram">
                      <div className="ai-result-diagram demographics-pick-button-diagram__item">
                        {/* Diagram */}
                        {/* Implement diagram based on confidence */}
                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ai-result-diagram-svg"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            strokeWidth="0.8"
                            className="ai-result-diagram-path"
                          ></circle>
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            strokeWidth="0.8"
                            className="ai-result-diagram-progress"
                            style={{
                              strokeDasharray: 313.652,
                              strokeDashoffset: `${
                                313.652 - (raceData.confidence / 100) * 313.652
                              }px`,
                            }}
                          ></circle>
                        </svg>
                        <div className="ai-result-percent">
                          {raceData.confidence}
                          <span className="ai-result-percent-sign">%</span>
                        </div>
                      </div>
                      <span className="demographics-pick-button-diagram__text">
                        Edit
                      </span>
                    </span>
                  </button>
                </li>
                {/* Age */}
                <li
                  className={`demographics-pick-button ${
                    selectedTab === "age" ? "react-tabs__tab--selected" : ""
                  }`}
                  role="tab"
                  onClick={() => handleTabSelect("age")}
                >
                  <button
                    className={`subhead anaylsis-pick-button ${
                      selectedTab === "age" ? "anaylsis-pick-active" : ""
                    }`}
                  >
                    <span className="anaylsis-pick-line">
                      <span className="anaylsis-pick-title">
                        {ageData.predicted}
                      </span>
                      <span className="anaylsis-pick-category">Age</span>
                    </span>
                    <span className="demographics-pick-button-diagram">
                      <div className="ai-result-diagram demographics-pick-button-diagram__item">
                        {/* Diagram */}
                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ai-result-diagram-svg"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            strokeWidth="0.8"
                            className="ai-result-diagram-path"
                          ></circle>
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            strokeWidth="0.8"
                            className="ai-result-diagram-progress"
                            style={{
                              strokeDasharray: 313.652,
                              strokeDashoffset: `${
                                313.652 - (ageData.confidence / 100) * 313.652
                              }px`,
                            }}
                          ></circle>
                        </svg>
                        <div className="ai-result-percent">
                          {ageData.confidence}
                          <span className="ai-result-percent-sign">%</span>
                        </div>
                      </div>
                      <span className="demographics-pick-button-diagram__text">
                        Edit
                      </span>
                    </span>
                  </button>
                </li>
                {/* Gender */}
                <li
                  className={`demographics-pick-button ${
                    selectedTab === "gender" ? "react-tabs__tab--selected" : ""
                  }`}
                  role="tab"
                  onClick={() => handleTabSelect("gender")}
                >
                  <button
                    className={`subhead anaylsis-pick-button ${
                      selectedTab === "gender" ? "anaylsis-pick-active" : ""
                    }`}
                  >
                    <span className="anaylsis-pick-line">
                      <span className="anaylsis-pick-title">
                        {genderData.predicted}
                      </span>
                      <span className="anaylsis-pick-category">Gender</span>
                    </span>
                    <span className="demographics-pick-button-diagram">
                      <div className="ai-result-diagram demographics-pick-button-diagram__item">
                        {/* Diagram */}
                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ai-result-diagram-svg"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            strokeWidth="0.8"
                            className="ai-result-diagram-path"
                          ></circle>
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            strokeWidth="0.8"
                            className="ai-result-diagram-progress"
                            style={{
                              strokeDasharray: 313.652,
                              strokeDashoffset: `${
                                313.652 -
                                (genderData.confidence / 100) * 313.652
                              }px`,
                            }}
                          ></circle>
                        </svg>
                        <div className="ai-result-percent">
                          {genderData.confidence}
                          <span className="ai-result-percent-sign">%</span>
                        </div>
                      </div>
                      <span className="demographics-pick-button-diagram__text">
                        Edit
                      </span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="demographics-right">
              {/* Tabs content */}
              <div className="demographics-panel" role="tabpanel">
                <div className="curtain-reveal-element demographics-race-confidence">
                  <div className="demographics-race-confidence__top-line">
                    <button
                      className="text-button IconButton_btn__g_osN IconButton_btn-horizontal__SD5o9 IconButton_btn--icon-left__b3LBo"
                      onClick={() => setSelectedTab("")}
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
                  <div className="subhead demographics-race-confidence__top">
                    <div>
                      {selectedTab.charAt(0).toUpperCase() +
                        selectedTab.slice(1)}
                    </div>
                    <div>A. I. confidence</div>
                  </div>
                  <div className="demographics-race-confidence__content">
                    {selectedData.confidences.map(
                      (item: { label: string; value: number }, index: number) => (
                        <button
                          key={index}
                          className={`demographics-race-confidence__row ${
                            item.label === selectedData.predicted
                              ? "demographics-race-confidence__row--selected"
                              : ""
                          }`}
                        >
                          <span className="demographics-race-confidence__key">
                            {item.label}
                          </span>
                          <span className="demographics-race-confidence__value">
                            {item.value}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Navigation */}
        <div className="BottomNav_container___bFFU analysis-inner-bottom-nav BottomNav_fixed__vB91O">
          <div className="BottomNav_left__ApQ4i">
            <div className="analysis-inner-back-btn-wrapper analysis-inner-clip-wrapper">
              <button onClick={handleGoBack}>
                <span className="text-button IconButton_btn__g_osN IconButton_btn-horizontal__SD5o9 IconButton_btn--icon-left__b3LBo">
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
                </span>
              </button>
            </div>
          </div>
          <div className="BottomNav_middle___LMac">
            <div className="analysis-bottom-nav-text">
              If A.I. estimate is wrong, select the correct one.
            </div>
          </div>
          <div className="BottomNav_right__Ulf7C">
            <button
              className="text-button btn Button_btn__wpFCD Button_btn-dark__QZyGW analysis-action-btn analysis-action-btn--reset Button_uppercase__bZ3k_"
              data-hover="Reset"
              onClick={handleReset}
              ref={resetButtonRef}
            >
              <span className="btn-inner Button_btn-inner___9jC5">Reset</span>
            </button>
            <button
              className="text-button btn Button_btn__wpFCD Button_btn-dark__QZyGW analysis-action-btn Button_uppercase__bZ3k_"
              data-hover="Confirm"
              onClick={handleConfirm}
              ref={confirmButtonRef}
            >
              <span className="btn-inner Button_btn-inner___9jC5">
                Confirm
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemographicsPage;
