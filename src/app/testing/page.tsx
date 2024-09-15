"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Header from "../components/layout/Header";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TestingPage: React.FC = () => {
  const router = useRouter();
  const faceScanBtnRef = useRef<HTMLButtonElement>(null);
  const galleryAccessBtnRef = useRef<HTMLButtonElement>(null);
  const animationSquareRef = useRef<HTMLSpanElement>(null);
  const [showToaster, setShowToaster] = useState(false);
  const toasterRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoBack = () => {
    router.back();
  };

  const handleGalleryAccess = () => {
    setShowToaster(true);
  };

  const handleCancel = () => {
    closeToaster();
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const sendImageToAPI = async (base64Image: string) => {
    const proxyUrl = '/api/proxy';
    const payload = { 
      'Image': base64Image.split(',')[1]  
    };
    console.log('API Payload (first 100 chars of Image):', payload.Image.substring(0, 100));
  
    try {
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API Response Data:', data);
      return data;
    } catch (error) {
      console.error('Error sending image to API:', error);
      throw error;
    }
  };

  const handleUpload = () => {
    closeToaster();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('File selected:', file.name);
        setIsLoading(true);
        setError(null);
        const startTime = Date.now();
        try {
          const base64Image = await convertToBase64(file);
          console.log('Base64 Image (first 100 chars):', base64Image.substring(0, 100));
          const response = await sendImageToAPI(base64Image);
          console.log('API Response:', response);
          setApiResponse(response);
          
          // Store the API response in sessionStorage
          sessionStorage.setItem('apiResponse', JSON.stringify(response));
          
          // Redirect to demographics page
          router.push('/demographics');
        } catch (error) {
          console.error('Error processing image:', error);
          setError('An error occurred while processing the image. Please try again.');
        } finally {
          const endTime = Date.now();
          const elapsedTime = endTime - startTime;
          if (elapsedTime < 5000) {
            await new Promise(resolve => setTimeout(resolve, 5000 - elapsedTime));
          }
          setIsLoading(false);
        }
      }
    };
    input.click();
  };

  const closeToaster = () => {
    if (toasterRef.current) {
      gsap.to(toasterRef.current, {
        height: "1px",
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(toasterRef.current, {
            width: "0px",
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => setShowToaster(false),
          });
        },
      });
    }
  };

  // GSAP animations
  useEffect(() => {
    const timeline = gsap.timeline({
      defaults: { duration: 1, ease: "power3.out" },
    });

    timeline.fromTo(
      faceScanBtnRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 }
    );
    timeline.fromTo(
      galleryAccessBtnRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 },
      "-=0.8"
    );
    timeline.fromTo(
      animationSquareRef.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1 },
      "-=0.8"
    );
  }, []);

  // Toaster animation
  useEffect(() => {
    if (showToaster && toasterRef.current) {
      gsap.set(toasterRef.current, {
        width: "0px",
        height: "1px",
        opacity: 1,
        display: "block",
      });
      gsap.to(toasterRef.current, {
        width: "30vw",
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(toasterRef.current, {
            height: "auto",
            duration: 0.6,
            ease: "power2.out",
          });
        },
      });
    }
  }, [showToaster]);

  return (
    <main
      className="main"
      style={{
        position: "relative",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header />

      {isLoading ? (
        <div className="LoadingScreen_screen__RwPOB">
          <div className="LoadingScreen_square-wrapper__CBirV">
            <span className="dotted-square LoadingScreen_square__3vC1I is-expanded is-animated"></span>
          </div>
          <div className="subhead LoadingScreen_text__WLug7">
            PREPARING YOUR ANALYSIS...
          </div>
        </div>
      ) : error ? (
        <div className="ErrorMessage" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      ) : (
        <div
          className="page wrapper"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="text-transition-container introduction-title-container">
            <h1 className="introduction-title js-introduction-title">
              To start analysis
            </h1>
          </div>

          <div
            className="testing-access-row"
            style={{ display: "flex", gap: "2rem" }}
          >
            <button
              ref={faceScanBtnRef}
              className="access-btn access-btn--right testing-access__btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <span
                className="dotted-square access-btn__square is-expanded is-animated cursor-not-allowed"
                ref={animationSquareRef}
              />
              <span className="access-btn__center">
                <span className="access-btn__icon cursor-not-allowed ">
                  <svg
                    width="136"
                    height="136"
                    viewBox="0 0 136 136"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                  >
                    <circle
                      cx="68.001"
                      cy="68"
                      r="57.786"
                      stroke="#1A1B1C"
                    ></circle>
                    <circle cx="68" cy="68" r="51" fill="#1A1B1C"></circle>
                    <path
                      d="M100.668 35.412C92.315 27.038 80.763 21.857 68 21.857a46.39 46.39 0 0 0-8.64.808c4.774 7.898 22.22 35.59 25.58 40.515.653.957 1.813-.944 8.838-14.487l6.89-13.281ZM25.088 51.004c5.493-13.858 17.506-24.422 32.253-27.91 1.746 2.619 5.081 7.793 8.726 13.555l9.26 14.642H48.886c-12.76 0-20.217-.083-23.798-.287ZM31.87 96.703A45.947 45.947 0 0 1 21.856 68c0-5.199.86-10.197 2.445-14.86h14.865c17.385 0 17.78.027 17.16 1.19-1.232 2.304-19.503 33.932-24.458 42.373ZM76.964 113.273c-2.9.57-5.897.87-8.964.87-13.808 0-26.2-6.066-34.656-15.678 1.827-4.06 6.585-12.533 14.828-26.454.775-1.31 1.56-2.23 1.745-2.045.185.184 6.687 10.554 14.45 23.042l12.597 20.265ZM111.529 83.348c-5.157 14.625-17.476 25.872-32.745 29.528-4.206-6.487-18.172-28.92-18.172-29.267 0-.143 12.07-.261 26.82-.261h24.097ZM101.902 36.697C109.5 44.922 114.143 55.919 114.143 68a46.11 46.11 0 0 1-2.199 14.115H96.597c-9.973 0-18.132-.15-18.132-.335 0-.38 19.972-38.764 23.437-45.083Z"
                      fill="#FCFCFC"
                    ></path>
                  </svg>
                </span>
                <span className="text-caption access-btn__text cursor-not-allowed">
                  Allow A.I. <br /> to scan your face
                </span>
              </span>
            </button>

            <div
              className="hidden lg:flex lg:items-center lg:justify-center lg:flex-col lg:absolute lg:inset-0"
              style={{ top: "90%", marginRight: "30px" }}
            >
              <Image
                src="/images/preffered-cross.svg"
                alt="Preferred Cross"
                width={60}
                height={60}
              />
              <p className="text-xs opacity-40 uppercase pt-1">
                Select preferred way
              </p>
            </div>

            <button
              ref={galleryAccessBtnRef}
              className="access-btn access-btn--left testing-access__btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }} 
              onClick={handleGalleryAccess}
            >
              <span className="dotted-square access-btn__square is-expanded is-animated" />
              <span className="access-btn__center">
                <span className="access-btn__icon">
                  <svg
                    width="136"
                    height="136"
                    viewBox="0 0 136 136"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                  >
                    <circle
                      cx="68.001"
                      cy="68"
                      r="57.786"
                      stroke="#1A1B1C"
                    ></circle>
                    <circle
                      cx="68"
                      cy="68"
                      r="50"
                      fill="#FCFCFC"
                      stroke="#1A1B1C"
                      strokeWidth="2"
                    ></circle>
                    <path
                      d="M78.321 68c7.042 0 12.75-5.708 12.75-12.75S85.363 42.5 78.321 42.5c-7.041 0-12.75 5.708-12.75 12.75S71.28 68 78.321 68Z"
                      fill="#1A1B1C"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17 68c0 3.96.451 7.815 1.306 11.516C23.526 102.136 43.794 119 68 119c26.867 0 48.882-20.776 50.856-47.138A51.96 51.96 0 0 0 119 68c0-28.166-22.834-51-51-51S17 39.834 17 68Zm18.337-.274L19.382 78.77A49.962 49.962 0 0 1 18.215 68c0-27.496 22.29-49.786 49.786-49.786 27.496 0 49.786 22.29 49.786 49.786 0 1.541-.07 3.066-.207 4.572l-34.634 19.24a7.286 7.286 0 0 1-7.91-.54l-31.18-23.385a7.286 7.286 0 0 0-8.518-.161Z"
                      fill="#1A1B1C"
                    ></path>
                  </svg>
                </span>
                <span className="text-caption access-btn__text">
                  ALLOW A.I. <br />
                  ACCESS TO GALLERY
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="BottomNav_container___bFFU" style={{ marginTop: "auto" }}>
        <div className="BottomNav_left__ApQ4i">
          <button
            className="text-button IconButton_btn__g_osN IconButton_btn-horizontal__SD5o9 IconButton_btn--icon-left__b3LBo js-introduction-left-bottom-link"
            onClick={handleGoBack}
            aria-label="Go back"
            style={{
              padding: "36px 20px",
              marginLeft: "12px",
            }}
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
      </div>

         {/* Toaster Notification */}
         {showToaster && (
        <div 
          ref={toasterRef}
          className="app-message AppMessage_container__vV0YG CookiesAgreement_container___Pi1s AppMessage_fixed__qcwRf curtain-enter-done"
          style={{
            position: "fixed",
            top: "200px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1a1b1c",
            color: "#fcfcfc",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 20,
            overflow: "hidden",
            display: "none",
            width: "100%", 
            maxWidth: "400px",
          }}
        >
          <div className="app-message__top AppMessage_top__SVYRx">
            <p>Please ensure your selfie has:</p>
            <div style={{borderBottom: '1px solid rgb(252, 252, 252)', width: '100%', position: 'absolute', left: 0, marginTop: '10px'}}></div>
            <ul className="list-unstyled text-caption analysis-message-list" style={{marginTop: '35px'}}>
              <li className="analysis-message-list__item ">Neutral Expression</li>
              <p>smiling may distort wrinkles</p>
              <li className="analysis-message-list__item ">Frontal Pose</li>
              <p>take the image from an arm's length away at eye level </p>
              <li className="analysis-message-list__item">Adequate Lighting</li>
              <p>avoid harsh downlighting and aim for natural or soft light </p>
            </ul>
          </div>
          <div className="app-message__bottom AppMessage_bottom__5GoID">
            <button 
              className="text-button btn Button_btn__wpFCD Button_btn-dark__QZyGW Button_uppercase__bZ3k_" 
              data-hover="Cancel" 
              style={{opacity: 0.7}}
              onClick={handleCancel}
            >
              <span className="btn-inner Button_btn-inner___9jC5">Cancel</span>
            </button>
            <button 
              className="text-button btn Button_btn__wpFCD Button_btn-dark__QZyGW Button_uppercase__bZ3k_" 
              data-hover="Upload"
              onClick={handleUpload}
            >
              <span className="btn-inner Button_btn-inner___9jC5">Upload</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default TestingPage;