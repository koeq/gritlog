import { useEffect, useState } from "react";

export const useGoogleScript = (shouldLoadScript: boolean): boolean => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (scriptLoaded || !shouldLoadScript) {
      return;
    }

    const loadScript = async () => {
      try {
        await loadScriptAsync("https://accounts.google.com/gsi/client");
        setScriptLoaded(true);
      } catch (error) {
        console.error("Failed to load google authentication script:", error);
      }
    };

    loadScript();
  }, [scriptLoaded, shouldLoadScript]);

  return scriptLoaded;
};

const loadScriptAsync = (src: string) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);

    script.onerror = () =>
      reject(new Error("Failed to load google authentication script"));

    document.head.appendChild(script);
  });
