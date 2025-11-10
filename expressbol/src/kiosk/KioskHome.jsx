// /src/kiosk/KioskHome.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useI18n } from "../i18n/I18nProvider";

export default function KioskHome() {
  const nav = useNavigate();
  const { t } = useI18n();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, []);

  const images = [
    "images/hero.png",
    "images/image5.png"
    // "images/image-2.png",
    // "images/image-3.png",
    // "images/image-4.png",
  ];

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        // backgroundImage: 'url("/images/background2.jpeg")',
        // backgroundRepeat: "repeat",
        // backgroundSize: "520px auto",
        // backgroundPosition: "top center",
        // backgroundColor: "#7AC142",
        // backgroundColor: "#7AB844",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap');

        :root{
          // --panel-bg: url("/images/background2.jpeg");
          //  --panel-bg: "#7AB844";
          --panel-bg: "#7ab844ff";
          --green-outer: #7ab844ff;

          --cream: #FFF1C9;
          --cream-edge: #E9E0BA;
          --card-border: #7AB844;         /* matches figma green frame */
          --card-shadow: rgba(0, 0, 0, .22);

          --btn-top: #FDB750;             /* figma yellow/orange */
          --btn-bottom: #FFCB69;
          --btn-hover-top: #F5A623;
          --btn-hover-bottom: #FDB750;
          --btn-text: #1a3a3a;            /* deep greenish text */
          --btn-shadow: rgba(0,0,0,.18);

          --title-text: #1a3a3a;
          --subtitle-text: #4a5a4a;
        }

        .wrap{
          width: 100%;
          max-width: 1100px;
          height: 100svh;
          display: flex; flex-direction: column;
          background: #f5f1e6;
          box-shadow: 0 4px 12px rgba(0,0,0,.15);
          font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        /* HERO strip (keeps your rotating banner) */
        .hero{ position: relative; width:100%; aspect-ratio: 6/5; overflow:hidden; }
        .hero img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0; transition:opacity 1s ease; }
        .hero img.active{ opacity:1; }

        /* Leafy green panel */
        .panel{
          flex:1 1 auto;
          background-image: var(--panel-bg);
          background-repeat: repeat;
          background-size: 520px auto;
          background-position: top center;
          background-color: var(--green-outer);
          padding: 24px 18px 30px;
          display:flex; justify-content:center;
        }

        /* Cream card with green border like figma */
        .card{
          width:min(900px, 96%);
          background: linear-gradient(130deg, #fffef0, #fdf8e1);
          border-radius: 24px;
          border: 4px solid var(--card-border);
          box-shadow:
            0 3px 0 var(--cream-edge) inset,
            0 18px 30px var(--card-shadow);
          padding: 28px 24px 24px;
          overflow: hidden;
        }

        /* Logo pill (simple) */
        .brand{
          display:flex; justify-content:center; margin-bottom: 10px;
        }
        .brand .logo{
          width: 96px; height: 96px; border-radius: 999px;
          background:#1a1a1a; display:flex; align-items:center; justify-content:center;
          border: 4px solid #FDB750; box-shadow: 0 10px 26px rgba(0,0,0,.25);
        }
        .brand .logo .line1{ color:#fff; font-size:12px; letter-spacing:.18em; font-weight:800; }
        .brand .logo .line2{ color:#7AB844; font-size:12px; letter-spacing:.18em; font-weight:800; margin-top:2px; }

        /* Headings like figma */
        .appname{
          text-align:center; color: var(--title-text);
          font-weight: 700; font-size: clamp(34px, 1.1vw, 16px); margin-top: 2px;
        }
        .title{
          text-align:center; color: var(--subtitle-text);
          font-weight: 800; font-size: clamp(16px, 1.5vw, 18px);
          letter-spacing:.12em; text-transform: uppercase; margin-top: 4px; margin-bottom: 24px;
        }

        /* Buttons column */
        .btns{ width:min(820px, 92%); margin: 0 auto; display:grid; gap:18px; }

        /* Yellow pill buttons + hover darken */
        .kbtn{
          display:flex; align-items:center; justify-content:center; gap:10px;
          width:100%; height:74px;
          padding: 0 22px;
          border-radius: 20px;
          border: 0;
          background-image: linear-gradient(90deg, var(--btn-top), var(--btn-bottom));
          color: var(--btn-text);
          font-weight: 500; letter-spacing:.06em; text-transform: uppercase;
           font-size: clamp(12px, 3vw, 18px);  /* ↑ make text larger */
          line-height: 1.15;                  /* comfy vertical rhythm */
          
          box-shadow:
            0 14px 22px rgba(0,0,0,.18),
            0 10px 0 var(--btn-shadow);
          transition: transform .12s ease, box-shadow .12s ease, background-image .12s ease, filter .12s ease;
        }
        .kbtn:hover{
          background-image: linear-gradient(90deg, var(--btn-hover-top), var(--btn-hover-bottom));
          box-shadow:
            0 18px 28px rgba(0,0,0,.22),
            0 12px 0 rgba(0,0,0,.26);
        }
        .kbtn:active{ transform: translateY(4px); box-shadow: 0 10px 0 rgba(0,0,0,.26); }
        .kbtn:focus-visible{ outline:3px solid rgba(0,0,0,.25); outline-offset:3px; }
        .kbtn svg{ width:26px; height:24px; opacity:.95; }
      `}</style>

      <div className="wrap">
        {/* HERO */}
        <div className="hero">
          {images.map((src, i) => (
            <img key={i} src={src} alt={`Hero ${i + 1}`} className={i === heroIndex ? "active" : ""} />
          ))}
        </div>

        {/* PANEL + CARD */}
        <div className="panel">
          <div className="card">
            {/* top logo */}
            <div className="brand">
              <img style={{ width: "156px" }} src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
            </div>

            {/* headings */}
            <div className="appname">TaylorGate</div>
            <div className="title">{t("kiosk.title") /* DRIVER CHECK-IN */}</div>

            {/* buttons */}
            <div className="btns" role="group" aria-label="Kiosk actions">
              <button className="kbtn" onClick={() => nav("/kiosk/driver")}>
                {/* truck icon */}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 7h11v7h-1.5a2 2 0 0 0-3.9 0H6.4a2 2 0 0 0-3.9 0H2V9l1-2zM14 9h3.6l2.1 3v2h-1.1a2 2 0 0 0-3.9 0H14V9zM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {t("kiosk.homebutton1")}
              </button>

              <button className="kbtn" onClick={() => nav("/kiosk/return")}>
                {/* user-check icon */}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Z" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="m16.5 10.5 1.8 1.8 3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {t("kiosk.homebutton2")}
              </button>

              <button className="kbtn" onClick={() => nav("/kiosk/status")}>
                {/* clipboard icon */}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 4h6v2h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3V4Z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {t("kiosk.homebutton3")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
