// /src/kiosk/KioskAdditionalDetails.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function KioskAdditionalDetails() {
  const nav = useNavigate();
  const { state } = useLocation();
  const driver = state?.driver;
  const orders = state?.orders || [];
  const id = state?.id || "";

  useEffect(() => {
    if (!driver || orders.length === 0) nav("/kiosk", { replace: true });
  }, [driver, orders, nav]);

  // Vehicle / load details (unchanged)
  const [carrierName, setCarrierName] = useState("");
  const [trailerLP, setTrailerLP] = useState("");
  const [trailerState, setTrailerState] = useState("");
  const [tractorNumber, setTractorNumber] = useState("");
  const [trailerNumber, setTrailerNumber] = useState("");
  const [driverlicense, setDriverLicense] = useState("");
  const [driverlicensestate, setDriverLicenseState] = useState("");
  const [federalInspection, setFederalInspection] = useState("");
  const [err, setErr] = useState("");

  const canContinue =
    carrierName && trailerLP && trailerState && trailerNumber && tractorNumber;

  function onNext() {
  
    setErr("");
    nav("/kiosk/review", {
      state: {
        driver,
        orders,
        id,
        vehicle: {
          driverlicense,
          driverlicensestate,
          carrierName,
          trailerLP,
          trailerState,
          tractorNumber,
          trailerNumber,
          federalInspection,
        },
      },
    });
  }

  return (
    <section
      className="details-bg"
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "min(4vh, 28px)",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap');

        :root{
          --tf-green:#7AB844;
          --tf-green-dark:#6AA534;
          --tf-cream:#FFFBEF;
          --tf-cream-2:#FDF6E3;
          --tf-cream-edge:#E9E0BA;
          --tf-title:#1a3a3a;
          --tf-subtle:#4a5a4a;
          --tf-input-bg:#F4F6F0;
          --tf-input-border:#CFE0C5;
          --tf-input-focus:#A8C88E;
          --shadow-outer: rgba(0,0,0,.22);
          --shadow-soft: rgba(0,0,0,.10);
        }

        .details-bg{
          background:
            radial-gradient(1200px 800px at 50% 0%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, var(--tf-green), #5B9230);
          background-attachment: fixed;
        }

        .sheet{
          width: min(860px, 92vw);
          position: relative;
          padding: clamp(22px, 3.2vh, 32px);
          padding-top: 72px; /* space for floating logo */
          background: linear-gradient(130deg, var(--tf-cream), var(--tf-cream-2));
          border: 4px solid var(--tf-green);
          border-radius: 22px;
          box-shadow: 0 18px 30px var(--shadow-outer), 0 3px 0 var(--tf-cream-edge) inset;
          font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        .brand{
          position:absolute;
          left:50%;
          top:0;
          transform: translate(-50%, -50%);
        }
        .brand img{ width:156px; display:block; }

        .title{
          text-align:center; color:var(--tf-title);
          font-weight:300; font-size: clamp(26px, 2.4vw, 34px);
          margin: 0 0 14px 0;
        }

        .field{ display:grid; gap:3px; margin-bottom:12px; }
        .label{ font-weight:300; color:var(--tf-title); font-size:18px; }

        .input{
          height: 44px;
          border-radius: 14px;
          padding: 0 14px;
          font-size: 16px;
          background: var(--tf-input-bg);
          border: 2px solid var(--tf-input-border);
          outline: none;
          box-shadow: inset 0 1px 0 rgba(0,0,0,.04);
        }
        .input::placeholder{ color:#98A59A; }
        .input:focus{
          border-color: var(--tf-input-focus);
          box-shadow: 0 0 0 3px rgba(168,200,142,.25);
          background:#fff;
        }

        .actions{ display:grid; gap:12px; margin-top: 18px; }

        .btn{
          appearance:none; border:0; cursor:pointer;
          width:40%; height:48px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          font-weight:500; letter-spacing:.02em;
          box-shadow: 0 10px 20px rgba(0,0,0,.12);
          transition: transform .08s ease, box-shadow .12s ease, background .12s ease;
          font-size:25px;
          margin-left:190px
        }
        .btn-primary{
          color:#fff;
          background: linear-gradient(90deg, var(--tf-green), #8BC850);
        }
        .btn-primary:hover{
          background: linear-gradient(90deg, var(--tf-green-dark), var(--tf-green));
          box-shadow: 0 14px 24px rgba(0,0,0,.16);
        }
        .btn-ghost{
          background:#fff; color:var(--tf-title);
          border:2px solid #D7DBCD;
          box-shadow:none; font-weight:500;
        }
        .btn:active{ transform: translateY(2px); }

        .err{ color:#b00020; font-weight:500; text-align:center; margin-top:10px; }
      `}</style>

      <div className="sheet">
        {/* floating logo like other screens */}
        <div className="brand">
          <img src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
        </div>

        <h2 className="title">Vehicle &amp; Load Details</h2>

        {/* --- form fields (unchanged logic) --- */}
        <div className="field">
          <label className="label">Driver's License</label>
          <input
            className="input"
            value={driverlicense}
            onChange={(e) => setDriverLicense(e.target.value)}
            placeholder="Type Driver License"
          />
        </div>

        <div className="field">
          <label className="label">Driver's License State</label>
          <input
            className="input"
            value={driverlicensestate}
            onChange={(e) => setDriverLicenseState(e.target.value)}
            placeholder="e.g., TX, CA, NY"
          />
        </div>

        <div className="field">
          <label className="label">Carrier Name</label>
          <input
            className="input"
            value={carrierName}
            onChange={(e) => setCarrierName(e.target.value)}
            placeholder="Type Carrier Name"
          />
        </div>

        <div className="field">
          <label className="label">Trailer Number</label>
          <input
            className="input"
            value={trailerNumber}
            onChange={(e) => setTrailerNumber(e.target.value)}
            placeholder="Enter Trailer Number"
          />
        </div>

        <div className="field">
          <label className="label">Trailer License Plate #</label>
          <input
            className="input"
            value={trailerLP}
            onChange={(e) => setTrailerLP(e.target.value)}
            placeholder="Enter Trailer LP #"
          />
        </div>

        <div className="field">
          <label className="label">Trailer State</label>
          <input
            className="input"
            value={trailerState}
            onChange={(e) => setTrailerState(e.target.value)}
            placeholder="e.g., TX, CA, NY"
          />
        </div>

        <div className="field">
          <label className="label">Tractor Number</label>
          <input
            className="input"
            value={tractorNumber}
            onChange={(e) => setTractorNumber(e.target.value)}
            placeholder="Enter Tractor Number"
          />
        </div>

        <div className="field">
          <label className="label">Federal Inspection Number (optional)</label>
          <input
            className="input"
            value={federalInspection}
            onChange={(e) => setFederalInspection(e.target.value)}
            placeholder="Enter Federal Inspection Number"
          />
        </div>

        {/* actions (same handlers) */}
        <div className="actions">
          <button className="btn btn-ghost" onClick={() => nav(-1)}>
            Back
          </button>
          <button className="btn btn-primary" onClick={onNext}>
            Continue to Review
          </button>
        </div>

        {err && <p className="err">{err}</p>}
      </div>
    </section>
  );
}
