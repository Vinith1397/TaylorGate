// // /src/kiosk/KioskDone.jsx
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function KioskDone() {
  const nav = useNavigate();
  const { state } = useLocation();

  // Redirect if someone lands directly
  useEffect(() => {
    if (!state?.driver) nav("/kiosk", { replace: true });
  }, [state, nav]);

  const driver = state?.driver ?? {};
  const vehicleFromStore = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("kiosk.vehicle") || "null"); }
    catch { return null; }
  }, []);
  const vehicle = state?.vehicle ?? vehicleFromStore ?? {};
  const orders = state?.orders ?? [];
  const message =
    state?.message || "Check-in confirmed successfully.";
  const checkinTime =
    state?.checkinTime ||
    new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  // Auto-return countdown (kept as-is, just smaller default)
  const [secondsLeft, setSecondsLeft] = useState(1200);
  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          nav("/kiosk", { replace: true });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [nav]);

  // Debug helper (unchanged behavior)
  useEffect(() => {
    const vehicleFromState = state?.vehicle;
    const vehicleFromStore = sessionStorage.getItem("kiosk.vehicle");
    window.debugVehicle = vehicleFromState || (vehicleFromStore && JSON.parse(vehicleFromStore));
  }, [state]);

  // Friendly orders text
  const ordersText = Array.isArray(orders) ? orders.join(", ") : String(orders ?? "—");

  return (
    <section className="done-bg" style={{
      minHeight: "100svh",
      display: "grid",
      placeItems: "center",
      padding: "min(4vh, 28px)",
      boxSizing: "border-box",
    }}>
      <style>{`
        :root{
          --tf-green:#7AB844; --tf-green-dark:#6AA534; --tf-green-darker:#5B9230;
          --tf-cream:#FFFBEF; --tf-cream-2:#FDF6E3; --tf-cream-edge:#E9E0BA;
          --tf-title:#1a3a3a;
        }
        .done-bg{
          background:
            radial-gradient(1200px 800px at 50% 0%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, var(--tf-green), var(--tf-green-darker));
          background-attachment: fixed;
        }

        .sheet{
          width:min(860px, 92vw);
          position:relative;
          background:linear-gradient(130deg, var(--tf-cream), var(--tf-cream-2));
          border:4px solid var(--tf-green);
          border-radius:22px;
          box-shadow:0 18px 30px rgba(0,0,0,.22), 0 3px 0 var(--tf-cream-edge) inset;
          padding:clamp(22px, 3.2vh, 32px);
          padding-top:72px; /* space for logo overlap */
          text-align:center;
        }

        .brand{
          position:absolute; left:50%; top:0; transform:translate(-50%, -50%);
        }
        .brand img{ width:156px; display:block; }

        .title{
          margin:0 0 4px 0;
          font-weight:500;
          font-size:clamp(22px, 2.6vw, 36px);
          color:var(--tf-title);
        }
        .subtitle{
          margin:6px 0 18px 0;
          color:#2c3b2c; font-weight:500;
          font-size:clamp(14px, 1.8vw, 22px);
        }

        .info-box{
          margin: 10px auto 20px auto;
          background:#fff;
          border-radius:18px;
          box-shadow:0 6px 18px rgba(0,0,0,.08);
          padding:24px 28px;
          width:min(700px, 90%);
          text-align:left;
          display:grid;
          gap:12px;
        }
        .info-row{
          display:flex; justify-content:space-between; align-items:center;
          border-bottom:1px dashed rgba(0,0,0,.1);
          padding-bottom:6px;
        }
        .label{
          font-weight:500; color:#333;
          font-size:clamp(15px, 1.8vw, 22px);
        }
        .value{
          font-weight:500; color:#111;
          font-size:clamp(15px, 1.8vw, 22px);
          text-align:right;
          word-break:break-word;
        }

        .btn{
          appearance:none; border:0; cursor:pointer;
          min-width: 180px; height:58px; border-radius:14px;
          font-size: clamp(18px, 2.2vw, 26px);
          font-weight: 500; letter-spacing:.02em;
          color:#fff;
          background:linear-gradient(90deg, var(--tf-green), #8BC850);
          box-shadow:0 10px 20px rgba(0,0,0,.12);
          transition:transform .08s ease, box-shadow .12s ease, background .12s ease;
        }
        .btn:hover{
          background:linear-gradient(90deg, var(--tf-green-dark), var(--tf-green));
          box-shadow:0 14px 24px rgba(0,0,0,.16);
        }
        .btn:active{ transform: translateY(2px); }

        .hint{ color:#2c3b2c; font-weight:500; margin-top:10px;font-size:14px }
        .count{ color:#445; margin-top:4px;font-size:16px }
      `}</style>

      <div className="sheet">
        <div className="brand">
          <img src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
        </div>

        <h2 className="title">Check-In Successful!</h2>
        <p className="subtitle">
          You will receive an SMS shortly with your Check-In ID / Appointment ID.
        </p>

        <div className="info-box">
          <div className="info-row">
            <span className="label">Driver Name:</span>
            <span className="value">{driver?.name || "—"}</span>
          </div>
          <div className="info-row">
            <span className="label">Phone Number:</span>
            <span className="value">{maskPhone(driver?.mobile)}</span>
          </div>
          <div className="info-row">
            <span className="label">Carrier:</span>
            <span className="value">{vehicle?.carrierName || "—"}</span>
          </div>
          <div className="info-row">
            <span className="label">Sales / Purchase Orders:</span>
            <span className="value">{ordersText || "—"}</span>
          </div>
          <div className="info-row">
            <span className="label">Check-in Time:</span>
            <span className="value">{checkinTime || "—"}</span>
          </div>
        </div>

        <button
          className="btn"
          onClick={() => nav("/kiosk", { replace: true })}
          type="button"
        >
          Home
        </button>

        <p className="hint">This screen will reset automatically.</p>
        <p className="count">Returning to Home in {secondsLeft}s…</p>
      </div>
    </section>
  );
}

// --- Helpers (unchanged behavior) ---
function maskPhone(p = "") {
  const d = p.replace(/\D/g, "");
  if (d.length < 4) return p || "—";
  return p.slice(0, -4).replace(/./g, "•") + p.slice(-4);
}
