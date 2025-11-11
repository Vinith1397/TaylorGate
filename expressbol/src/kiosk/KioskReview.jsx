// import { useEffect, useState,useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function KioskReview() {
//   const nav = useNavigate();
//   const { state } = useLocation();
//   const driver = state?.driver;
//   const orders = state?.orders || [];
//   const id = state?.id || "";
  

//   console.log(state?.id )

//   const vehicleFromStore = useMemo(() => {
//     try { return JSON.parse(sessionStorage.getItem("kiosk.vehicle") || "null"); }
//     catch { return null; }
//   }, []);
//   const vehicle = state?.vehicle || vehicleFromStore || {};

//   useEffect(() => {
//     console.log("🟢 Received KioskReview state:", state);
//     console.log("🚚 vehicle (state):", state?.vehicle);
//     console.log("💾 vehicle (session):", vehicleFromStore);
//   }, [state, vehicleFromStore]);

//   const [posting, setPosting] = useState(false);
//   const [err, setErr] = useState("");
//   const [trailerClean, setTrailerClean] = useState(true);
//   const [trailerOdorFree, setTrailerOdorFree] = useState(true);
//   const [trailerPreCooled, setTrailerPreCooled] = useState(false);
//   const [temperature, setTemperature] = useState("");

//   useEffect(() => {
//     if (!driver || orders.length === 0) nav("/kiosk", { replace: true });
//   }, [driver, orders, nav]);

//   console.log( "orders from previos",orders )

//   useEffect(() => {
//   console.log("🟢 Received KioskReview state:", state);
// }, [state]);
  
//   async function onCheckIn() {
//     console.log("id",id)
//     try {
//       setPosting(true);
//       setErr("");

//       const payload = {      
//     id: id,
//     carrierName: vehicle?.carrierName || "",
//     driverLicense: vehicle?.driverlicense || "",
//     driverLicenseState :  vehicle?.driverlicensestate || "",
//     tractorNumber: vehicle?.tractorNumber || "",
//     trailerNumber: vehicle?.trailerNumber|| "",
//     trailerLP: vehicle?.trailerLP || "",
//     trailerState: vehicle?.trailerState || "",
//     federalInspection: vehicle?.federalInspection || ""
//          };

//       console.log("Submitting Check-In Payload:", payload);


//      const res = await axios.post("https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net/api/Kiosk/updateFreightDetails", payload);
//       console.log("Check-In API Response:", res);
//       const checkInTime = res?.checkInTime
//       // ✅ Success condition
//       if (
//         res?.success ||
//         /success/i.test(res?.message || "") ||
//         res?.data?.message === "Check-in confirmed"
//       ) {
        
//         nav("/kiosk/done", {
//           state: {
//             driver,
//             orders,
//             vehicle,
//             message: res.message || "Check-in confirmed successfully.",
//             checkInTime,
          

//           },
//         });
//       } else {
//         setErr(res?.data?.message || "Check-in failed. Please try again.");
//       }
//     } catch (e) {
//       console.error("Check-in API Error:", e);
//       setErr(
//         e?.response?.data?.message ||
//           e.message ||
//           "Network error. Please try again."
//       );
//     } finally {
//       setPosting(false);
//     }
//   }



//   return (
//     <section
//       style={{
//         minHeight: "100svh",
//         display: "grid",
//         placeItems: "center",
//         padding: "min(4vh, 28px)",
//         backgroundImage: 'url("/images/panel_background.png")',
//         backgroundRepeat: "repeat",
//         backgroundSize: "520px auto",
//         backgroundColor: "#F5F1E6",
//       }}
//     >
//       <style>{`
//         .sheet {
//           width: min(880px, 94vw);
//           background: #f2f7cef;
//           border-radius: 20px;
//           box-shadow: 0 10px 30px rgba(0,0,0,.15);
//           padding: clamp(24px, 4vh, 40px);
        
//         }
//         .title {
//           text-align: center;
//           font-size: clamp(22px, 2.6vw, 30px);
//           font-weight: 800;
//           color: #111;
//           margin-bottom: 18px;
//         }
//         .info-box {
//           background: #fff;
//           border-radius: 16px;
//           padding: 18px 20px;
//           margin-bottom: 18px;
//           font-size: clamp(16px, 1.8vw, 18px);
//         }
//         .grid { display: grid; gap: 14px; margin-top: 40px;margin-left: 240px;margin-bottom:40px }
//         .row  { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
//         // .row { display: grid; justify-content: start; margin: 4px 0; flex-wrap: wrap; gap:10px }
//         .label { font-weight: 700; color: #333; font-size: 10px}
//         .confirm {  
//           border-radius: 16px;
//           padding: 16px;
//           margin: 14px 0;
//         }
//         .confirm h3 {
//           text-align: center;
//           color: #B00020;
//           margin-bottom: 10px;
//           font-size: clamp(18px, 2vw, 22px);
//         }
//         .checkboxes { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 10px; }
//         .checkboxes label { display: flex; align-items: center; gap: 6px; font-weight: 600; color: #222; }
//         .temp-box { display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; }
//         .temp-box input {
//           width: 80px;
//           text-align: center;
//           border: 2px solid #ccc;
//           border-radius: 8px;
//           font-size: 18px;
//           height: 40px;
//         }
//         .question {
//           text-align: center;
//           font-size: clamp(20px, 2.4vw, 26px);
//           color: #B00020;
//           font-weight: 800;
//           margin-top: 16px;
//         }
//         .buttons {
//           display: flex;
//           justify-content: center;
//           gap: 20px;
//           margin-top: 16px;
//           flex-wrap: wrap;
//         }
//         .btn {
//           min-width: 180px;
//           height: 58px;
//           border-radius: 999px;
//           font-size: clamp(18px, 2.2vw, 20px);
//           font-weight: 700;
//           border: none;
//           cursor: pointer;
//           transition: transform .06s ease;
//         }
//         .btn:active { transform: scale(.98); }
//         .btn-green { background: #86B837; color: #000; }
//         .btn-red { background: #ff5252; color: #fff; }
//         .err { color: #b00020; font-weight: 700; text-align: center; margin-top: 8px; }

//         .details-grid {
//     display: grid;
//     gap: 14px;
//     margin: 32px auto 36px auto;
//     width: min(780px, 90vw);
  
//     border-radius: 18px;
 
//     box-shadow: 0 8px 20px rgba(0,0,0,.08);
//     padding: 28px 36px;
//   }

//   .details-row {
//     display: flex;
//     flex-wrap: wrap;
//     align-items: center;
//     justify-content: space-between;
//     border-bottom: 1px dashed rgba(0,0,0,.08);
//     padding-bottom: 6px;
//     margin-bottom: 4px;
//   }

//   .details-label {
//     font-weight: 700;
//     color: #111;
//     font-size: clamp(15px, 1.8vw, 17px);
//     flex: 1 1 40%;
//     max-width: 300px;
//   }

//   .details-value {
//     color: #222;
//     font-size: clamp(15px, 1.8vw, 17px);
//     flex: 1 1 55%;
//     font-weight: 500;
//     text-align: right;
//     word-break: break-word;
//   }

//   @media (max-width: 640px) {
//     .details-row { flex-direction: column; align-items: flex-start; }
//     .details-label, .details-value { text-align: left; flex: 1 1 100%; }
//   }
//       `}</style>

//       <div className="sheet">
//         <h2 className="title">Confirm and Complete your Check-In</h2>

//        <div className="details-grid">
//   <div className="details-row">
//     <span className="details-label">Driver Name:</span>
//     <span className="details-value">{driver?.name}</span>
//   </div>
//   <div className="details-row">
//     <span className="details-label">Phone #:</span>
//     <span className="details-value">{driver?.mobile}</span>
//   </div>
//   <div className="details-row">
//     <span className="details-label">Driver License:</span>
//     <span className="details-value">{vehicle?.driverlicense}</span>
//   </div>
//   <div className="details-row">
//     <span className="details-label">Driver License State:</span>
//     <span className="details-value">{vehicle?.driverlicensestate}</span>
//   </div>
//   <div className="details-row">
//     <span className="details-label">Carrier Name:</span>
//     <span className="details-value">{vehicle?.carrierName}</span>
//   </div>
//   <div className="details-row">
//     <span className="details-label">Trailer LP#:</span>
//     <span className="details-value">{vehicle?.trailerLP}</span>
//   </div>
//   <div className="details-row">
//     <span className="details-label">Trailer State:</span>
//     <span className="details-value">{vehicle?.trailerState}</span>
//   </div>
//   <div className="details-row">
//     <span className="details-label">Trailer #:</span>
//     <span className="details-value">{vehicle?.trailerNumber}</span>
//   </div>
//   <div className="details-row">
//     <span className="details-label">Tractor #:</span>
//     <span className="details-value">{vehicle?.tractorNumber}</span>
//   </div>
//   {vehicle?.federalInspection && (
//     <div className="details-row">
//       <span className="details-label">Federal Inspection #:</span>
//       <span className="details-value">{vehicle?.federalInspection}</span>
//     </div>
//   )}
//   <div className="details-row">
//     <span className="details-label">Sales / Purchase Orders:</span>
//     <span className="details-value">{Array.isArray(orders) ? orders.join(", ") : String(orders ?? "—")}</span>
//   </div>
// </div>

//         <div className="confirm">
//           <h3>Confirm Trailer Condition Below:</h3>
//           <div className="checkboxes">
//             <label>
//               <input type="checkbox" checked={trailerClean} onChange={(e) => setTrailerClean(e.target.checked)} />
//               Trailer is Clean
//             </label>
//             <label>
//               <input type="checkbox" checked={trailerOdorFree} onChange={(e) => setTrailerOdorFree(e.target.checked)} />
//               Trailer is Free of Odor
//             </label>
//             <label>
//               <input type="checkbox" checked={trailerPreCooled} onChange={(e) => setTrailerPreCooled(e.target.checked)} />
//               Trailer is Pre-Cooled
//             </label>
//           </div>
//           <div className="temp-box">
//             Temp&nbsp;
//             <input
//               type="number"
//               value={temperature}
//               onChange={(e) => setTemperature(e.target.value)}
//               placeholder="°F"
//             />
//           </div>
//         </div>

//         <div className="question">Confirm Checkin?</div>

//         <div className="buttons">
//           <button
//             className="btn btn-green"
//             onClick={onCheckIn}
//             disabled={posting}
//           >
//             {posting ? "Checking In..." : "Check In"}
//           </button>
//           <button
//             className="btn btn-red"
//             onClick={() => nav(-1)}
//             disabled={posting}
//           >
//         Back
//           </button>
//         </div>

//         {err && <p className="err">{err}</p>}
//       </div>
//     </section>
//   );
// }


// /src/kiosk/KioskReview.jsx
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function KioskReview() {
  const nav = useNavigate();
  const { state } = useLocation();
  const driver = state?.driver;
  const orders = state?.orders || [];
  const id = state?.id || "";

  const vehicleFromStore = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("kiosk.vehicle") || "null"); }
    catch { return null; }
  }, []);
  const vehicle = state?.vehicle || vehicleFromStore || {};

  useEffect(() => {
    if (!driver || orders.length === 0) nav("/kiosk", { replace: true });
  }, [driver, orders, nav]);

  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");
  const [trailerClean, setTrailerClean] = useState(true);
  const [trailerOdorFree, setTrailerOdorFree] = useState(true);
  const [trailerPreCooled, setTrailerPreCooled] = useState(false);
  const [temperature, setTemperature] = useState("");

  async function onCheckIn() {
    try {
      setPosting(true);
      setErr("");

      const payload = {
        id: id,
        carrierName: vehicle?.carrierName || "",
        driverLicense: vehicle?.driverlicense || "",
        driverLicenseState: vehicle?.driverlicensestate || "",
        tractorNumber: vehicle?.tractorNumber || "",
        trailerNumber: vehicle?.trailerNumber || "",
        trailerLP: vehicle?.trailerLP || "",
        trailerState: vehicle?.trailerState || "",
        federalInspection: vehicle?.federalInspection || ""
      };
      console.log( "paylod",payload)
      const res = await axios.post(
        "https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net/api/Kiosk/updateFreightDetails",
        payload
      );

      //  const res = {data: {
      //     message: "Check-in confirmed",
      //     id: payload?.id || "MOCK-ID-12345",
      //     received: payload,
      //   }
      // }
      const checkInTime = res?.data?.checkInTime;
       console.log( "res",res)
      if (
        res?.data?.success ||
        /success/i.test(res?.message || "") ||
        res?.data?.message === "Check-in Confirmed"
      ) {
        nav("/kiosk/done", {
          state: {
            driver,
            orders,
            vehicle,
            message: res.message || "Check-in confirmed successfully.",
            checkInTime,
          },
        });
      } else {
        setErr(res?.data?.message || "Check-in failed. Please try again.");
      }
    } catch (e) {
      setErr(
        e?.response?.data?.message || e.message || "Network error. Please try again."
      );
    } finally {
      setPosting(false);
    }
  }

  return (
    <section
      className="review-bg"
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
          --tf-green:#7AB844; --tf-green-dark:#6AA534; --tf-green-darker:#5B9230;
          --tf-cream:#FFFBEF; --tf-cream-2:#FDF6E3; --tf-cream-edge:#E9E0BA;
          --tf-title:#1a3a3a; --tf-subtle:#4a5a4a;
        }

        .review-bg{
          background:
            radial-gradient(1200px 800px at 50% 0%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, var(--tf-green), var(--tf-green-darker));
          background-attachment: fixed;
          font-family:"Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        .sheet{
          width:min(820px, 94vw);
          position:relative;
          background:linear-gradient(130deg, var(--tf-cream), var(--tf-cream-2));
          border:4px solid var(--tf-green);
          border-radius:22px;
          box-shadow:0 18px 30px rgba(0,0,0,.22), 0 3px 0 var(--tf-cream-edge) inset;
          padding:clamp(24px, 3.2vh, 36px);
          padding-top:76px; /* space for logo overlap */
        }

        .brand{ position:absolute; left:50%; top:0; transform:translate(-50%, -50%); }
        .brand img{ width:156px; display:block; }

        .title{
          text-align:center; color:#143a14;
          font-size:clamp(22px, 2.6vw, 36px);
          font-weight:500; margin:0 0 10px 0;
        }

        /* Details panel */
        .details-grid{
          background:#ffffff;
          border:1px solid #E2E6D8;
          border-radius:18px;
          width:min(820px, 92%);
          margin:24px auto 26px auto;
          padding:26px 30px;
          box-shadow:0 8px 20px rgba(0,0,0,.08);
        }
        .details-row{
          display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between;
          border-bottom:1px dashed rgba(0,0,0,.08);
          padding:10px 2px;
        }
        .details-row:last-child{ border-bottom:none; }
        .details-label{
          font-weight:500; color:#1b2d1b;
          font-size:clamp(10px, 1.8vw, 17px);
          flex:1 1 42%; max-width:320px;
          font-size: 16px;
        }
        .details-value{
          color:#243824; font-weight:100;
          font-size:clamp(10px, 1.8vw, 17px);
          flex:1 1 55%; text-align:right; word-break:break-word;
           font-size: 16px;
        }
        @media (max-width:640px){
          .details-row{ flex-direction:column; align-items:flex-start; }
          .details-value{ text-align:left; }
        }

        /* Checklist section */
        .confirm{
          background:#F0F7E9;
          border:1px solid #D0E4C6;
          border-left:4px solid var(--tf-green);
          border-radius:14px;
          padding:16px 18px;
          margin: 14px 0 6px 0;
        }
        .confirm h3{
          text-align:center; color:#1a3a3a; margin:0 0 10px 0;
          font-size:clamp(18px, 2vw, 22px); font-weight:300;
        }
        .checkboxes{ display:flex; flex-wrap:wrap; gap:14px; justify-content:center; }
        .checkboxes label{ display:flex; align-items:center; gap:8px; font-weight:700; color:#223;font-size:16px }

        .temp-box{ display:flex; align-items:center; justify-content:center; gap:8px; margin-top:10px; font-weight:500; color:#223;font-size:16px }
        .temp-box input{
          width:90px; height:42px; text-align:center;
          border:2px solid #CFE0C5; border-radius:10px; font-size:18px; outline:none;
        }
        .temp-box input:focus{
          border-color:#A8C88E; box-shadow:0 0 0 3px rgba(168,200,142,.25);
        }

        .question{
          text-align:center; font-size:clamp(20px, 2.4vw, 28px);
          color:#143a14; font-weight:500; margin:18px 0 6px 0;
        }

        /* Buttons */
        .buttons{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-top:12px; }
        .btn{
          min-width:200px; height:56px; border-radius:14px;
          font-size:clamp(24px, 2.2vw, 26px); font-weight:500;
          border:none; cursor:pointer;
          box-shadow:0 10px 20px rgba(0,0,0,.12);
          transition:transform .08s ease, box-shadow .12s ease, background .12s ease, opacity .12s ease;
        }
        .btn:active{ transform:translateY(2px); }
        .btn-green{
          background:linear-gradient(90deg, var(--tf-green), #8BC850); color:#fff;
        }
        .btn-green:hover{
          background:linear-gradient(90deg, var(--tf-green-dark), var(--tf-green));
          box-shadow:0 14px 24px rgba(0,0,0,.16);
        }
        .btn-red{
          background:#ff5b5b; color:#fff;
        }
        .btn[disabled]{ opacity:.65; cursor:not-allowed; }

        .err{ color:#b00020; font-weight:700; text-align:center; margin-top:8px; }
      `}</style>

      <div className="sheet">
        {/* Logo to match other pages */}
        <div className="brand">
          <img src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
        </div>

        <h2 className="title">Confirm and Complete your Check-In</h2>

        {/* Summary */}
        <div className="details-grid">
          <div className="details-row">
            <span className="details-label">Driver Name:</span>
            <span className="details-value">{driver?.name}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Phone #:</span>
            <span className="details-value">{driver?.mobile}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Driver License:</span>
            <span className="details-value">{vehicle?.driverlicense}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Driver License State:</span>
            <span className="details-value">{vehicle?.driverlicensestate}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Carrier Name:</span>
            <span className="details-value">{vehicle?.carrierName}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Trailer LPN:</span>
            <span className="details-value">{vehicle?.trailerLP}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Trailer State:</span>
            <span className="details-value">{vehicle?.trailerState}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Trailer #:</span>
            <span className="details-value">{vehicle?.trailerNumber}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Tractor #:</span>
            <span className="details-value">{vehicle?.tractorNumber}</span>
          </div>
          {vehicle?.federalInspection && (
            <div className="details-row">
              <span className="details-label">Federal Inspection #:</span>
              <span className="details-value">{vehicle?.federalInspection}</span>
            </div>
          )}
          <div className="details-row">
            <span className="details-label">Sales / Purchase Orders:</span>
            <span className="details-value">
              {Array.isArray(orders) ? orders.join(", ") : String(orders ?? "—")}
            </span>
          </div>
        </div>

        {/* Trailer confirmation */}
        <div className="confirm">
          <h3>Confirm Trailer Condition Below:</h3>
          <div className="checkboxes">
            <label>
              <input
                type="checkbox"
                checked={trailerClean}
                onChange={(e) => setTrailerClean(e.target.checked)}
              />
              Trailer is Clean
            </label>
            <label>
              <input
                type="checkbox"
                checked={trailerOdorFree}
                onChange={(e) => setTrailerOdorFree(e.target.checked)}
              />
              Trailer is Free of Odor
            </label>
            <label>
              <input
                type="checkbox"
                checked={trailerPreCooled}
                onChange={(e) => setTrailerPreCooled(e.target.checked)}
              />
              Trailer is Pre-Cooled
            </label>
          </div>
          <div className="temp-box">
            Temp
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="°F"
            />
          </div>
        </div>

        <div className="question">Confirm Checklist</div>

        <div className="buttons">
          <button className="btn btn-red" onClick={() => nav(-1)} disabled={posting}>
            Back
          </button>
          <button className="btn btn-green" onClick={onCheckIn} disabled={posting}>
            {posting ? "Checking In..." : "Check In"}
          </button>
        </div>

        {err && <p className="err">{err}</p>}
      </div>
    </section>
  );
}
