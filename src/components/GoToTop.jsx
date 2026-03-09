// components/GoToTop.jsx
// scroll progress indicator
import React, { useState, useEffect } from "react";
import "./GoToTop.css";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Show button and calculate scroll progress
  const toggleVisibility = () => {
    // Calculate how far down the page has scrolled (as percentage)
    const winScroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    setScrollProgress(scrolled);

    if (winScroll > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="go-to-top progress"
          aria-label="Go to top"
          title="Go to top"
        >
          <svg
            className="progress-ring"
            width="54"
            height="54"
            viewBox="0 0 54 54"
          >
            <circle
              className="progress-ring__circle-bg"
              stroke="#e0e0e0"
              strokeWidth="3"
              fill="transparent"
              r="24"
              cx="27"
              cy="27"
            />
            <circle
              className="progress-ring__circle"
              stroke="white"
              strokeWidth="3"
              fill="transparent"
              r="24"
              cx="27"
              cy="27"
              style={{
                strokeDasharray: `${2 * Math.PI * 24}`,
                strokeDashoffset: `${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`,
              }}
            />
          </svg>
          <svg
            className="arrow-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}
    </>
  );
};

export default GoToTop;
