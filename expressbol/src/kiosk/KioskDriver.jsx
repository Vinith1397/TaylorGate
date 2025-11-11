// // /src/kiosk/KioskDriver.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { sendOtp, verifyOtp } from "./KioskApi";
// import { useI18n } from "../i18n/I18nProvider";

// export default function KioskDriver() {
//   const nav = useNavigate();
//   const [name, setName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [licenseId, setLicenseId] = useState("");
//   const [otpReq, setOtpReq] = useState(null);
//   const [code, setCode] = useState("");
//   const [sending, setSending] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const [err, setErr] = useState("");
//   const { t } = useI18n();

//   const canSend = name.trim() && mobile.trim();

//   async function onSend() {
//     try {
//       setErr("");
//       setSending(true);
//       const res = await sendOtp(mobile, licenseId);
//       setOtpReq(res?.requestId ?? null);
//     } catch {
//       setErr("Failed to send OTP. Please retry.");
//     } finally {
//       setSending(false);
//     }
//   }

//   async function onVerify() {
//     try {
//       setErr("");
//       setVerifying(true);
//       const res = await verifyOtp(otpReq, code, mobile);
//       if (res.verified) {
//         nav("/kiosk/find", {
//           state: { driver: { name, mobile, licenseId }, otpVerified: true },
//         });
//       } else {
//         setErr(res.message || "Invalid OTP. Try again.");
//       }
//     } catch {
//       setErr("Verification failed. Try again.");
//     } finally {
//       setVerifying(false);
//     }
//   }

//   return (
//     <section
//       className="driver-bg"
//       style={{
//         minHeight: "100svh",
//         display: "grid",
//         placeItems: "center",
//         padding: "min(4vh, 28px)",
//         backgroundImage: 'url("/images/background2.jpeg")',
//         backgroundRepeat: "repeat",
//         backgroundSize: "520px auto",
//         backgroundPosition: "top center",
//         backgroundColor: "#3C8B45",
//         boxSizing: "border-box",
//       }}
//     >
//       <style>{`
//         :root{
//           --tf-leaf-bg: url("/images/background.png");
//           --tf-green: #3C8B45;
//           --tf-cream: #FFF1C9;
//           --tf-cream-edge:#E9E0BA;
//           --tf-title:#213021;
//           --tf-input-border:#D7DFB8;
//           --tf-btn-top:#2f8b5f;      /* button green gradient top */
//           --tf-btn-bot:#22744c;      /* button green gradient bottom */
//           --tf-btn-text:#D7E83E;     /* yellow text */
//           --tf-shadow: rgba(0,0,0,.18);
//         }

//         /* Background helper (already applied inline) */
//         .driver-bg{
//           background-image: var(--tf-leaf-bg);
//           background-repeat: repeat;
//           background-size: 520px auto;
//           background-position: top center;
//           background-color: var(--tf-green);
//         }

//         /* Cream card */
//         .sheet {
//           width: min(820px, 92vw);
//           background: var(--tf-cream);
//           border-radius: 20px;
//           box-shadow: 0 3px 0 var(--tf-cream-edge) inset, 0 10px 30px var(--tf-shadow);
//           padding: clamp(22px, 3.5vh, 36px);
//           border: 1px solid rgba(0,0,0,.06);
//         }

//         /* Title plaque */
//         .title {
//           margin: 0 0 18px 0;
//           width: 100%;
//           background: var(--tf-cream);
//           color: var(--tf-title);
//           border-radius: 16px;
//           padding: 14px 18px;
//           text-align: center;
//           font-weight: 900;
//           font-size: clamp(22px, 2.4vw, 30px);
//           letter-spacing: .8px;
//           text-transform: uppercase;
//           box-shadow: 0 6px 0 rgba(0,0,0,.15);
//         }

//         .form { display: grid; gap: clamp(14px, 2vh, 18px); }
//         .field { display: grid; gap: 10px; }

//         .label {
//           font-weight: 800;
//           font-size: clamp(14px, 1.5vw, 16px);
//           color: #213021;
//         }

//         .control {
//           display: block;
//           width: 100%;
//           height: clamp(52px, 7vh, 60px);
//           padding: 0 16px;
//           font-size: clamp(17px, 2.1vw, 20px);
//           line-height: 1.2;
//           border: 2px solid var(--tf-input-border);
//           border-radius: 12px;
//           background: #fffdf6;
//           outline: none;
//           box-shadow: inset 0 1px 0 rgba(0,0,0,.05);
//         }
//         .control:focus {
//           border-color: #a6c78f;
//           box-shadow: 0 0 0 3px rgba(70,130,60,.18);
//         }

//         .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         @media (max-width: 640px) { .row { grid-template-columns: 1fr; } }

//         /* Primary green button with yellow text */
//         .btn {
//           appearance: none; border: 0; cursor: pointer; width: 100%;
//           height: clamp(52px, 7vh, 60px);
//           border-radius: 14px;
//           font-size: clamp(16px, 2vw, 20px);
//           font-weight: 900; letter-spacing: .8px;
//           color: var(--tf-btn-text);
//           background: linear-gradient(180deg, var(--tf-btn-top), var(--tf-btn-bot));
//           box-shadow: 0 10px 0 var(--tf-shadow);
//           transition: transform .08s ease, box-shadow .08s ease, filter .12s ease;
//         }
//         .btn:active { transform: translateY(4px); box-shadow: 0 6px 0 var(--tf-shadow); }
//         .btn[disabled] { opacity: .6; cursor: not-allowed; }

//         /* Ghost secondary */
//         .btn-ghost {
//           background: #fff; color: #213021;
//           border: 2px solid var(--tf-input-border);
//           box-shadow: none;
//           font-weight: 800;
//         }

//         .hint { text-align:center; color:#2b3c2b; font-size: clamp(12px,1.6vw,14px); opacity:.85; }
//         .err  { color: #b00020; font-weight: 700; text-align: center; }
//       `}</style>

//       <div className="sheet">
//         <h2 className="title">{t("kiosk.drivertitle")}</h2>

//         <form className="form" onSubmit={(e) => e.preventDefault()}>
//           <div className="field">
//             <label className="label">{t("kiosk.drivername")}</label>
//             <input
//               className="control"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               autoComplete="name"
//               required
//             />
//           </div>

//           {/* Uncomment if you need license ID later
//           <div className="field">
//             <label className="label">Driver License ID</label>
//             <input
//               className="control"
//               value={licenseId}
//               onChange={(e) => setLicenseId(e.target.value)}
//               autoComplete="off"
//             />
//           </div>
//           */}

//           <div className="field">
//             <label className="label">{t("kiosk.drivermobile")}</label>
//             <input
//               className="control"
//               inputMode="tel"
//               autoComplete="tel"
//               placeholder="+1XXXXXXXXXX"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               required
//             />
//           </div>

//           <p className="hint" style={{ textAlign: "left", marginTop: 4 }}>
//             By verifying your mobile number, you agree to receive transactional SMS
//             (OTP, check-in, and BOL status updates) from Taylor Farms for this visit.
//             Msg &amp; data rates may apply.
//           </p>

//           {!otpReq ? (
//             <div style={{ display: "flex", justifyContent: "center" }}>
//               <button
//                 type="button"
//                 className="btn"
//                 onClick={onSend}
//                 style={{ width: "40%" }}
//                 disabled={!canSend || sending}
//               >
//                 {sending ? "Sending…" : t("kiosk.sendotp")}
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="field" style={{ marginTop: 6 }}>
//                 <label className="label">Enter OTP</label>
//                 <input
//                   className="control"
//                   inputMode="numeric"
//                   maxLength={8}
//                   value={code}
//                   onChange={(e) => setCode(e.target.value)}
//                 />
//               </div>

//               <div className="row">
//                 <button type="button" className="btn btn-ghost" onClick={onSend}>
//                   Resend
//                 </button>
//                 <button
//                   type="button"
//                   className="btn"
//                   onClick={onVerify}
//                   disabled={!code || verifying}
//                 >
//                   {verifying ? "Verifying…" : "Verify & Continue"}
//                 </button>
//               </div>
//             </>
//           )}

//           {err && <p className="err">{err}</p>}
//           {!err && (
//             <p className="hint">Driver Name and Mobile number are required fields.</p>
//           )}
//         </form>
//       </div>
//     </section>
//   );
// }


// /src/kiosk/KioskDriver.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "./KioskApi";
import { useI18n } from "../i18n/I18nProvider";

export default function KioskDriver() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [otpReq, setOtpReq] = useState(null);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [err, setErr] = useState("");
  const { t } = useI18n();

  const canSend = name.trim() && mobile.trim();

  async function onSend() {
    try {
      setErr("");
      setSending(true);
      const res = await sendOtp(mobile, licenseId);
      setOtpReq(res?.requestId ?? null);
    } catch {
      setErr("Failed to send OTP. Please retry.");
    } finally {
      setSending(false);
    }
  }

  async function onVerify() {
    try {
      setErr("");
      setVerifying(true);
      const res = await verifyOtp(otpReq, code, mobile);
      if (res.verified) {
        nav("/kiosk/find", {
          state: { driver: { name, mobile, licenseId }, otpVerified: true },
        });
      } else {
        setErr(res.message || "Invalid OTP. Try again.");
      }
    } catch {
      setErr("Verification failed. Try again.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <section
      className="driver-bg"
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "min(4vh, 28px)",
        // backgroundImage: 'url("/images/background.png")',
        // backgroundRepeat: "repeat",
        // backgroundSize: "520px auto",
        // backgroundPosition: "top center",
        // backgroundColor: "#3C8B45",
         backgroundColor: "#7AB844",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap');

        :root{
          --tf-green: #7AB844;           /* brand green for borders/badges */
          --tf-green-dark:#6AA534;
          --tf-green-darker:#5B9230;

          --tf-cream: #FFFBEF;           /* card gradient start */
          --tf-cream-2: #FDF6E3;         /* card gradient end */
          --tf-cream-edge:#E9E0BA;       /* inner bevel */

          --tf-title:#1a3a3a;
          --tf-subtle:#4a5a4a;

          --tf-input-bg:#F4F6F0;
          --tf-input-border:#CFE0C5;
          --tf-input-focus:#A8C88E;

          --shadow-outer: rgba(0,0,0,.22);
          --shadow-soft: rgba(0,0,0,.10);
        }

//         .sheet {
//           width: min(860px, 92vw);
//           background: linear-gradient(130deg, var(--tf-cream), var(--tf-cream-2));
//           border: 4px solid var(--tf-green);
//           border-radius: 22px;
//           box-shadow: 0 18px 30px var(--shadow-outer), 0 3px 0 var(--tf-cream-edge) inset;
//           padding: clamp(22px, 3.2vh, 32px);
//           font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
//         }
//           .brand { display:flex; justify-content:center; }
// .brand img { display:block; }

 /* Cream card */
        .sheet {
          width: min(860px, 92vw);
          position:relative;
          /* make space for the overlapped logo (sits half outside) */
          padding-top: 84px;
          background: linear-gradient(130deg, var(--tf-cream), var(--tf-cream-2));
          border: 4px solid var(--tf-green);
          border-radius: 22px;
          box-shadow: 0 18px 30px var(--shadow-outer), 0 3px 0 var(--tf-cream-edge) inset;
          padding-left: clamp(22px, 3.2vh, 32px);
          padding-right: clamp(22px, 3.2vh, 32px);
          padding-bottom: clamp(22px, 3.2vh, 32px);
          font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        /* Logo overlaps the top edge of the card */
        .brand{
          position:absolute;
          left:50%;
          top:0;
          transform: translate(-50%, -50%);
        }
        .brand img{ width:156px; display:block; }
        
        /* Back link */
        .back {
          display:flex; align-items:center; gap:8px;
          color: var(--tf-title);
          font-weight: 700;
          cursor: pointer;
          width:max-content;
          margin-bottom: 12px;
          font-size:14px
        }
        .back:hover { color: var(--tf-green-dark); }
        .back svg{ width:18px; height:18px; }

        /* Center badge + headings */
        .badge {
          width: 64px; height: 64px; border-radius: 999px;
          background: var(--tf-green);
          display:flex; align-items:center; justify-content:center;
          margin: 6px auto 14px;
          box-shadow: 0 8px 18px var(--shadow-soft);
        }
        .badge svg{ width:30px; height:30px; color:#fff; }

        .h1 {
          text-align:center; color: var(--tf-title);
          font-weight: 500; font-size: clamp(28px, 2vw, 36px);
          margin: 0;
        }
        .h2 {
          text-align:center; color: var(--tf-subtle);
          font-weight: 600; font-size: clamp(16px, 1.6vw, 18px);
          margin: 6px 0 18px 0;
        }

        .form { display:grid; gap: clamp(16px, 2vh, 20px); }
        .field { display:grid; gap: 10px; }

        .label {
          font-weight: 500; color: var(--tf-title);
          font-size: clamp(18px, 1.6vw, 24px);
        }

        .control {
          width: 100%;
          height: clamp(54px, 7vh, 62px);
          padding: 0 16px;
          font-size: clamp(16px, 2vw, 18px);
          border: 2px solid var(--tf-input-border);
          border-radius: 14px;
          background: var(--tf-input-bg);
          outline: none;
          box-shadow: inset 0 1px 0 rgba(0,0,0,.04);
        }
        .control::placeholder { color:#98A59A; }
        .control:focus {
          border-color: var(--tf-input-focus);
          box-shadow: 0 0 0 3px rgba(168,200,142,.25);
          background:#fff;
        }

        .info {
          background:#F0F7E9;
          border-left:4px solid var(--tf-green);
          padding: 12px 14px;
          border-radius: 10px;
          color: var(--tf-title);
          font-size: 12px;
          line-height: 1.4;
        }

        .btn-row { display:flex; justify-content:center; }

        /* Primary big green gradient button */
        .btn {
          appearance:none; border:0; cursor:pointer;
          width: min(260px, 100%);
          height: 58px;
          border-radius: 16px;
          background: linear-gradient(90deg, var(--tf-green), #8BC850);
          color:#fff;
          font-weight: 500; letter-spacing:.04em;
          font-size: clamp(20px, 2vw, 20px);
          display:flex; align-items:center; justify-content:center; gap:10px;
          box-shadow: 0 10px 20px rgba(0,0,0,.12);
          transition: transform .08s ease, filter .12s ease, box-shadow .12s ease, background .12s ease;
        }
        .btn:hover{
          background: linear-gradient(90deg, var(--tf-green-dark), var(--tf-green));
          box-shadow: 0 14px 24px rgba(0,0,0,.16);
        }
          .btn svg {
  width: 30px;
  height: 30px;
}
        .btn:active{ transform: translateY(3px); box-shadow: 0 8px 18px rgba(0,0,0,.14); }
        .btn[disabled]{ opacity:.6; cursor:not-allowed; }

        .btn-ghost{
          width:100%;
          height:58px;
          border-radius: 14px;
          background:#fff;
          color: var(--tf-title);
          border:2px solid var(--tf-input-border);
          font-weight:500;
          font-size :23px
        }

        .muted { text-align:start; color:#6a756a; font-size:12px; }
        .err  { color:#b00020; font-weight:500; text-align:center; }
      `}</style>
       {/* <div className="brand">
              <img style={{ width: "156px" ,marginBottom : "0px"}} src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
            </div> */}
      <div className="sheet">

         <div className="brand">
          <img src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
        </div>
        {/* Back */}
        <button className="back" onClick={() => nav(-1)} type="button">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Badge + headings */}
        <div className="badge">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 7h11v7h-1.5a2 2 0 0 0-3.9 0H6.4a2 2 0 0 0-3.9 0H2V9l1-2zM14 9h3.6l2.1 3v2h-1.1a2 2 0 0 0-3.9 0H14V9z" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        </div>
        <h2 className="h1">Trucker Check-in</h2>
        <p className="h2">Please provide your details</p>

        {/* Form */}
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label className="label">{t("kiosk.drivername")} *</label>
            <input
              className="control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="field">
            <label className="label">{t("kiosk.drivermobile")} *</label>
            <input
              className="control"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 (XXX) XXX-XXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="info">
            <input style={{width : "12px",height : "12px"
            }}type="checkbox" />
            By verifying your mobile number, you agree to receive transactional SMS
            (OTP, check-in, and BOL status updates) from Taylor Farms for this visit.
            Msg &amp; data rates may apply.
          </div>

          {!otpReq ? (
            <div className="btn-row">
              <button
                type="button"
                className="btn"
                onClick={onSend}
                disabled={!canSend || sending}
              >
                {/* paper-plane icon */}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m22 2-7.5 20-3.5-8-8-3.5L22 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="m11 14 11-12" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                {sending ? "Sending…" : t("kiosk.sendotp")}
              </button>
            </div>
          ) : (
            <>
              <div className="field" style={{ marginTop: 6 }}>
                <label className="label">Enter OTP *</label>
                <input
                  className="control"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Enter 6–8 digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button type="button" className="btn-ghost" onClick={onSend}>
                  Resend
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={onVerify}
                  disabled={!code || verifying}
                >
                  {verifying ? "Verifying…" : "Verify & Continue"}
                </button>
              </div>
            </>
          )}

          {err && <p className="err">{err}</p>}
          {!err && <p className="muted">* Required fields</p>}
        </form>
      </div>
    </section>
  );
}
