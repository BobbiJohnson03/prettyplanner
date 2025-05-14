/// <reference types="vite/client" />
declare namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
  
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.92/build/spline-viewer.js";
    document.body.appendChild(script);
  }, []);
  