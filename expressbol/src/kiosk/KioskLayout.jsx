// /src/kiosk/KioskLayout.jsx
import { Outlet, UNSAFE_WithHydrateFallbackProps, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const THEME = {
  primary: "#C1CE09",
  accent: "#D7E83E",
  text: "#000",
};

export default function KioskLayout() {
  useIdleReset(1200_0000); // 90s inactivity → go back to /kiosk

  return (
    <section
      style={{
        minHeight: "80lvh",
         //background: THEME.primary,
        // backgroundImage: 'url("/images/background.png")',
        background :"#F5F1E6",
        backgroundRepeat: "repeat",          // tile the pattern
        backgroundSize: "520px auto",        // tweak tile size to taste (e.g., 480–560px)
        backgroundPosition: "top center",
        backgroundColor: "#F5F1E6",          // subtle fallback while image loads
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            // borderRadius: 16,
            background: "#f7fae3",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          <Outlet />
        </div>
      </div>
    </section>
  );
}

function useIdleReset(timeoutMs) {
  const navigate = useNavigate();
  useEffect(() => {
    let t;
    const bump = () => {
      clearTimeout(t);
      t = setTimeout(() => navigate("/kiosk", { replace: true }), timeoutMs);
    };
    const events = ["touchstart", "click", "keydown", "mousemove"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    bump();
    return () => {
      clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, bump));
    };
  }, [navigate, timeoutMs]);
}
