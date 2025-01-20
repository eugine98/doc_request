// import React, { useEffect, useRef } from 'react';

// interface TurnstileProps {
//   sitekey: string;
//   onSuccess: (token: string) => void;
// }

// const Turnstile: React.FC<TurnstileProps> = ({ sitekey, onSuccess }) => {
//   const turnstileRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//     if (window.turnstile && turnstileRef.current) {
//       window.turnstile.render(turnstileRef.current, {
//         sitekey,
//         callback: onSuccess,
//       });
//     }

//     // Cleanup function to remove the Turnstile widget if needed
//     return () => {
//       if (turnstileRef.current) {
//         turnstileRef.current.innerHTML = '';
//       }
//     };
//   }, [sitekey, onSuccess]); // Dependencies should be stable

//   return <div ref={turnstileRef} className="cf-turnstile"></div>;
// };

// export default Turnstile;
import React, { useEffect, useRef, useState } from "react";

// Define types for Turnstile widget
interface TurnstileProps {
  sitekey: string;
  onSuccess?: (token: string) => void; // Callback for success
}

const Turnstile: React.FC<TurnstileProps> = ({ sitekey, onSuccess }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isWidgetRendered, setIsWidgetRendered] = useState(false);

  useEffect(() => {
    // Load the Turnstile script if not already loaded
    if (!isScriptLoaded) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script); // Cleanup script
      };
    }
  }, [isScriptLoaded]);

  useEffect(() => {
    if (
      isScriptLoaded &&
      !isWidgetRendered &&
      containerRef.current &&
      window.turnstile
    ) {
      // Initialize the Turnstile widget
      window.turnstile.render(containerRef.current, {
        sitekey,
        callback: (token: string) => {
          if (onSuccess) {
            onSuccess(token); // Call the success callback with the token
          }
        },
      });
      setIsWidgetRendered(true);
    }
  }, [isScriptLoaded, isWidgetRendered, sitekey, onSuccess]);

  return <div ref={containerRef} style={{ textAlign: "center" }}></div>;
};

export default Turnstile;
