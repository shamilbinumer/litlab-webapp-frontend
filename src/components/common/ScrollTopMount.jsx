import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTopMount = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the pathname changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollTopMount;