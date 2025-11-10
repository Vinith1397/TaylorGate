import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useI18n } from "../i18n/I18nProvider";

export default function KioskHome() {
  const nav = useNavigate();
  const { t } = useI18n();
  const [heroIndex, setHeroIndex] = useState(0);

  // reference palette
  const ref = {
    leafBg: "#7AC142",            // page pattern base (already in your bg image)
    cream: "#FFF1C9",             // title plaque
    plaqueText: "#222222",
    btnTop: "#FFD14A",            // button gradient (top)
    btnBottom: "#E9A92E",         // button gradient (bottom)
    btnText: "#222222",           // very dark charcoal like the reference
    btnShadow: "rgba(0,0,0,.25)", // drop shadow behind buttons
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((p) => (p + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const images = [
    "images/hero.png",
    "images/image-2.png",
    "images/image-3.png",
    "images/image-4.png",
  ];

  return (
    <section
      style={{
        maxHeight: "80lvh",
        maxWidth: "100lvh",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        backgroundImage: 'url("/images/background.png")',
        backgroundRepeat: "repeat",
        backgroundSize: "520px auto",
        backgroundPosition: "top center",
        backgroundColor: "#F5F1E6",
      }}
    >
      <style>{`
        :root {
          --plaque-cream: ${ref.cream};
          --plaque-text: ${ref.plaqueText};
          --btn-top: ${ref.btnTop};
          --btn-bottom: ${ref.btnBottom};
          --btn-text: ${ref.btnText};
          --btn-shadow: ${ref.btnShadow};
        }

        .kiosk-wrap {
          width: 100%;
          max-width: 1100px;
          background: #f7fae3;
          box-shadow: 0 4px 12px rgba(0,0,0,.15);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100svh;
        }

        .hero {
          position: relative;
          width: 100%;
          aspect-ratio: 4/ 3;
          overflow: hidden;
        }
        .hero img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          transition: opacity 1s ease-in-out;
          opacity: 0;
        }
        .hero img.active { opacity: 1; }

        .panel {
          flex: 1 1 auto;
          background-image: url("/images/background2.jpeg");
          backgroundRepeat: "repeat",
        backgroundSize: "520px auto",
        backgroundPosition: "top center",
          padding: 20px 16px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .brand { display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:6px; }

        /* ===== Title plaque like the reference ===== */
        .title-plaque {
          width: min(880px, 92%);
          background: var(--plaque-cream);
          color: var(--plaque-text);
          border-radius: 18px;
          padding: 18px 20px;
          text-align: center;
          box-shadow: 0 6px 0 rgba(0,0,0,.15);           /* lifted block */
          font-weight: 800;
          font-size: clamp(22px, 2.6vw, 34px);
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        /* ===== Big yellow buttons ===== */
        .btn-col {
          width: min(880px, 92%);
          display: grid;
          gap: 18px;
          margin-top: 4px;
        }

        .kbtn {
          appearance: none; border: none; cursor: pointer;
          width: 100%;
          border-radius: 16px;
          padding: 18px 22px;
          background: linear-gradient(180deg, var(--btn-top), var(--btn-bottom));
          color: var(--btn-text);
          font-weight: 900;                           /* bold like mock */
          font-size: clamp(18px, 2.1vw, 28px);
          letter-spacing: .8px;
          text-transform: uppercase;
          box-shadow: 0 10px 0 var(--btn-shadow);     /* thick drop shadow (offset) */
          transition: transform .08s ease, box-shadow .08s ease, filter .15s ease;
        }
        .kbtn:active {
          transform: translateY(4px);                 /* press in */
          box-shadow: 0 6px 0 var(--btn-shadow);
        }
        .kbtn:focus-visible { outline: 3px solid rgba(0,0,0,.25); outline-offset: 3px; }

        /* The “Load Status” button is a darker variant in the screenshot */
        .kbtn.status {
          background: linear-gradient(180deg, #C8A339, #8B6F10);
          color: #fffdf6;
        }

        /* no text selection in kiosk */
        .kbtn, .title-plaque { user-select: none; -webkit-user-select: none; }
      `}</style>

      <div className="kiosk-wrap">
        <div className="hero">
          {images.map((img, i) => (
            <img key={i} src={img} alt={`Hero ${i + 1}`} className={i === heroIndex ? "active" : ""} />
          ))}
        </div>

        <div className="panel">
          <div className="brand">
            <img style={{ width: "96px" }} src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
          </div>

          {/* Title plaque */}
          <div className="title-plaque">{t("kiosk.title")}</div>

          {/* Buttons */}
          <div className="btn-col" role="group" aria-label="Kiosk actions">
            <button className="kbtn" onClick={() => nav("/kiosk/driver")} aria-label="Start check-in for new driver">
              {t("kiosk.homebutton1")}
            </button>

            <button className="kbtn" onClick={() => nav("/kiosk/return")} aria-label="Continue check-in for returning driver">
              {t("kiosk.homebutton2")}
            </button>

            <button className="kbtn status" onClick={() => nav("/kiosk/status")} aria-label="View load status">
              {t("kiosk.homebutton3")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
