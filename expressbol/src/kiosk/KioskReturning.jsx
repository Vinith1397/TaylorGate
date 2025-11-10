// import { useState,useEffect } from "react";
// import { useLocation, useNavigate} from "react-router-dom";
// import { getCheckInDetails } from "./KioskApi";

// export default function KioskReturning() {
//   const nav = useNavigate();
//   const [AppointmentId, setAppointmentId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [data, setData] = useState(null); // holds fetched check-in details
//   const { state } = useLocation();

//   const canSearch = AppointmentId.trim().length > 0;

//   async function onSearch() {
//     if (!canSearch) return;
//     setErr("");
//     setLoading(true);
//     setData(null);

//     try {
//       //const res = await getCheckInDetails(AppointmentId.trim());
//        const res = {status : "ok"}
//       // Accept flexible shapes
//       const ok =
//         res?.success === true ||
//         res?.status === "ok" ||
//         res?.status === 200 ||
//         !!res?.id ||
//         !!res?.AppointmentId;

//       if (!ok) {
//         setErr(res?.message || "No record found for that Check-In ID.");
//         return;
//       }

//       setData(res);
//     } catch (e) {
//       setErr(
//         e?.response?.data?.message ||
//           e?.message ||
//           "Failed to fetch details. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Try to extract a PDF URL from several possible fields
//   function getPdfUrl() {
//     return (
//       data?.pdfUrl ||
//       data?.bolPdfUrl ||
//       data?.documents?.find?.(d => /pdf/i.test(d?.mime || d?.url || ""))?.url ||
//       null
//     );
//   }

//   function viewPdf() {
//     const url = getPdfUrl();
//     if (!url) {
//       setErr("No PDF available to view.");
//       return;
//     }
//     window.open(url, "_blank", "noopener,noreferrer");
//   }

//   function printPdf() {
//     const url = getPdfUrl();
//     if (!url) {
//       setErr("No PDF available to print.");
//       return;
//     }
//     // Open and print via a hidden iframe (works on kiosk/iPad)
//     const iframe = document.createElement("iframe");
//     iframe.style.position = "fixed";
//     iframe.style.right = "0";
//     iframe.style.bottom = "0";
//     iframe.style.width = "0";
//     iframe.style.height = "0";
//     iframe.style.border = "0";
//     iframe.src = url;
//     iframe.onload = () => {
//       try {
//         iframe.contentWindow.focus();
//         iframe.contentWindow.print();
//       } catch {
//         // Fall back to opening a tab if cross-origin prevents print
//         window.open(url, "_blank", "noopener,noreferrer");
//       }
//     };
//     document.body.appendChild(iframe);
//     setTimeout(() => document.body.removeChild(iframe), 30_000);
//   }



//   // 5s auto reset + countdown
//   const [secondsLeft, setSecondsLeft] = useState(30);
//   useEffect(() => {
//     const t = setInterval(() => {
//       setSecondsLeft((s) => {
//         if (s <= 1) {
//           clearInterval(t);
//           nav("/kiosk", { replace: true });
//           return 0;
//         }
//         return s - 1;
//       });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [nav]);

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
//         backgroundPosition: "top center",
//         backgroundColor: "#f2f7ce", // same as Driver/Find
//         boxSizing: "border-box",
//       }}
//     >
//       <style>{`
//         :root{
//           --sheet-bg: #f2f7cef ;
//           --sheet-border: rgba(0,0,0,.08);
//           --sheet-radius: 18px;
//           --sheet-shadow: 0 10px 30px rgba(0,0,0,.15);
//         }
//         .sheet {
//           width: min(820px, 92vw);
//           background: var(--sheet-bg);
//           border: 1px solid var(--sheet-border);
//           border-radius: var(--sheet-radius);
//           box-shadow: var(--sheet-shadow);
//           padding: clamp(20px, 3.5vh, 36px);
//         }
//         .title {
//           margin: 0 0 18px 0;
//           font-weight: 800;
//           font-size: clamp(22px, 2.6vw, 28px);
//           text-align: center;
//           color: #111;
//         }
//         .form { display: grid; gap: clamp(14px, 2vh, 18px); }
//         .field { display: grid; gap: 10px; }
//         .label { font-weight: 800; font-size: clamp(16px, 1.8vw, 18px); color: #222; }
//         .control {
//           display: block; width: 100%;
//           height: clamp(56px, 7vh, 64px);
//           padding: 0 16px;
//           font-size: clamp(18px, 2.2vw, 22px);
//           line-height: 1.2;
//           border: 2px solid #c9c9c9;
//           border-radius: 14px;
//           background: #fff;
//           outline: none;
//         }
//         .control:focus { border-color: #86B837; box-shadow: 0 0 0 3px rgba(134,184,55,.2); }
//         .btn {
//           appearance: none; border: 0; cursor: pointer; width: 100%;
//           height: clamp(56px, 7vh, 64px);
//           border-radius: 999px;
//           font-size: clamp(18px, 2.2vw, 22px);
//           font-weight: 900; letter-spacing: .3px;
//           color: #000;
//           background: #31b32dbb;
//           border: 2px solid #111;
//           box-shadow: 0 6px 16px rgba(0,0,0,.12);
//           transition: transform .06s ease, filter .12s ease, opacity .12s ease;
//         }
//         .btn:active { transform: translateY(1px) scale(.995); }
//         .btn[disabled] { opacity: .6; cursor: not-allowed; }
//         .btn-ghost { background: #fff; color: #222; border: 2px solid #c9c9c9; }
//         .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         @media (max-width: 640px){ .row { grid-template-columns: 1fr; } }
//         .hint { text-align:center; color:#666; font-size: clamp(14px,1.8vw,16px); }
//         .err  { color: #b00020; font-weight: 700; text-align: center; }
//         .card {
//           background: #fff;
//           border: 1px solid #e4e4e4;
//           border-radius: 14px;
//           padding: 14px;
//         }
//         .kv { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
//         .kv .k { min-width: 160px; font-weight: 800; }
//       `}</style>

//       <div className="sheet">
//         <h2 className="title">Returning Driver</h2>
 
//         <div className="form">
//            {!data && (
//           <div className="form">
//             <Field label="Enter Appointment ID">
//               <input
//                 className="control"
//                 value={AppointmentId}
//                 onChange={e => setAppointmentId(e.target.value)}
//                 placeholder="e.g., 20250101-009tf "
//               />
//             </Field>

//             <div className="row">
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => nav(-1)}
//                 disabled={loading}
//                 style={{ borderRadius: 14, fontWeight: 500 }}
//               >
//                 Back
//               </button>
//               <button
//                 className="btn"
//                 onClick={onSearch}
//                 disabled={!canSearch || loading}
//                 style={{ borderRadius: 14, fontWeight: 500 }}
//               >
//                 {loading ? "Searching…" : "Find"}
//               </button>
//             </div>

//             {err && <p className="err">{err}</p>}
//             {!err && <p className="hint">Enter your Check-In ID to view status and documents.</p>}
//           </div>
//         )}

          

//           {/* {err && <p className="err">{err}</p>} */}

//           {data && (
//             <div className="card" style={{ display: "grid", gap: 10,
//                 backgroundImage: 'url("/images/panel_background.png")',
//         backgroundRepeat: "repeat",
//         backgroundSize: "520px auto",
//         backgroundPosition: "top center",
//         backgroundColor: "#f2f7ce", // same as Driver/Find

//              }}>
//               <h3 style={{ margin: 0, fontWeight: 800 }}>Check-In Details</h3>

//               <KV k="Check-In ID" v={data?.checkInId || data?.id } />
//               <KV k="Checked-In At" v={fmtDateTime(data?.checkedInAt || data?.createdAt)} />

//               <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

//               <KV
//                 k="Driver"
//                 v={formatDriver(
//                   data?.driver || {
//                     name: data?.driverName,
//                     mobile: data?.driverMobile,
//                     licenseId: data?.driverLicenseId,
//                   }
//                 )}
//               />
//               <KV k="Appointment ID" v={data?.appointmentId ?? "—"} />
//               <KV
//                 k="Sales Orders"
//                 v={
//                   (data?.salesOrderIds && data.salesOrderIds.length > 0
//                     ? data.salesOrderIds.join(", ")
//                     : "—")
//                 }
//               />

//               <div className="row" style={{ marginTop: 8 }}>
//                 <button
//                   className="btn btn-ghost"
//                   onClick={viewPdf}
//                   style={{ borderRadius: 14, fontWeight: 500 }}
//                 >
//                   View PDF
//                 </button>
//                 <button
//                   className="btn"
//                   onClick={printPdf}
//                   style={{ borderRadius: 14, fontWeight: 500 }}
//                 >
//                   Print PDF
//                 </button>

//                 </div>

//                  <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 gap: 4,
//                 marginTop: 20,
//               }}
//             >
//               <button
//                 className="btn"
//                 style={{ borderRadius: 14, fontWeight: 500, width: "auto", padding: "0 28px" }}
//                 onClick={() => nav("/kiosk", { replace: true })}
//               >
//                 Home
//               </button>
//               <p className="hint">This screen will reset automatically.</p>
//               <p className="count">Returning to home in {secondsLeft}s…</p>
            
//               </div>

              
//             </div>
//           )}
          
//         </div>

//       </div>
//     </section>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <label className="field">
//       <span className="label">{label}</span>
//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #c9c9c9",
//           borderRadius: 12,
//           padding: 8,
//         }}
//       >
//         {children}
//       </div>
//     </label>
//   );
// }

// function KV({ k, v }) {
//   return (
//     <div className="kv">
//       <span className="k">{k}:</span>
//       <span>{v}</span>
//     </div>
//   );
// }

// function fmtDateTime(s) {
//   if (!s) return "—";
//   const d = new Date(s);
//   if (Number.isNaN(d.getTime())) return s;
//   return d.toLocaleString();
// }

// function formatDriver(d = {}) {
//   const name = d?.name || "—";
//   const phone = d?.mobile ? maskPhone(d.mobile) : "—";
//   const lic = d?.licenseId ? maskId(d.licenseId) : "—";
//   return `${name} • ${phone} • ${lic}`;
// }

// function maskPhone(p = "") {
//   const digits = p.replace(/\D/g, "");
//   if (digits.length < 4) return p || "—";
//   return p.slice(0, -4).replace(/./g, "•") + p.slice(-4);
// }
// function maskId(id = "") {
//   if (!id) return "—";
//   if (id.length < 3) return id;
//   return "•••" + id.slice(-3);
// }
// KioskReturning.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ===== CHANGE ME if your API path differs (you pasted this host) =====

  

export default function KioskReturning() {
  const nav = useNavigate();

  const [truckId, setTruckId] = useState("");
  const [soInput, setSoInput] = useState("");
  const [poInput, setPoInput] = useState("");

  const [soList, setSoList] = useState([]);
  const [poList, setPoList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const addSO = () => {
    const v = soInput.trim();
    if (!v) return;
    if (!soList.includes(v)) setSoList((a) => [...a, v]);
    setSoInput("");
  };
  const addPO = () => {
    const v = poInput.trim();
    if (!v) return;
    if (!poList.includes(v)) setPoList((a) => [...a, v]);
    setPoInput("");
  };
  const removeSO = (id) => setSoList((xs) => xs.filter((x) => x !== id));
  const removePO = (id) => setPoList((xs) => xs.filter((x) => x !== id));

  const SEARCH_URL = 
  `https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net/api/Admin/appointment/truck/${truckId}`;
  async function onContinue() {
    setErr("");
    if (!truckId && soList.length === 0 && poList.length === 0) {
      setErr("Please enter Truck ID or at least one Sales/Purchase Order ID.");
      return;
    }

    // Build a flexible query string. Your backend can read any of these keys.
    // const qs = new URLSearchParams();
    // if (truckId.trim()) qs.set("truckId", truckId.trim());
    // if (soList.length) qs.set("salesOrders", soList.join(","));
    // if (poList.length) qs.set("purchaseOrders", poList.join(","));

    try {
      setLoading(true);
      // const res = await fetch(`${SEARCH_URL}?${qs.toString()}`, {
         const res = await fetch(`${SEARCH_URL}`, {
        method: "GET",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Search failed (${res.status}).`);
      }

      const data = await res.json();
      // Expecting:
      // { message: "Success", downloadLinks: [{ salesOrderNumber, blobUrlLink }] }
      const raw = Array.isArray(data?.downloadLinks) ? data.downloadLinks : [];

      if (!raw.length) {
        setErr("No BOLs found for the given details.");
        return;
      }

      // Normalize results for the next page
      const results = raw.map((r) => ({
        salesOrderNumber: r?.salesOrderNumber || "",
        bolUrl: r?.blobUrlLink || "",
      }));

      nav("/kiosk/signbol", {
        state: {
          query: {
            truckId: truckId.trim() || null,
            salesOrders: soList,
            purchaseOrders: poList,
          },
          results,
        },
      });
    } catch (e) {
      setErr(
        e?.message ||
          "We couldn’t fetch BOLs right now. Please verify the details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "min(4vh, 28px)",
        backgroundColor: "#7AB844",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        :root{
          --tg-outer: #7AB844;
          --tg-cream: #fffef0;
          --tg-cream-2: #fdf8e1;
          --tg-cream-edge: #E9E0BA;
          --tg-card-border: #7AB844;

          --txt-1:#1a3a3a;
          --txt-2:#4a5a4a;

          --y1:#FDB750; --y2:#FFCB69;
          --y1h:#F5A623; --y2h:#FDB750;
          --ytext:#1a3a3a;

          --g1:#8BC34A; --g2:#79B73E;
          --gh1:#7CB342; --gh2:#6AA936;
        }
        .sheet-wrap{ width:min(840px, 94vw); position: relative; }
        .sheet{
          background: linear-gradient(130deg, var(--tg-cream), var(--tg-cream-2));
          border: 4px solid var(--tg-card-border);
          border-radius: 24px;
          box-shadow: 0 3px 0 var(--tg-cream-edge) inset, 0 18px 30px rgba(0,0,0,.18);
          padding: clamp(22px, 3.2vh, 32px);
          padding-top:64px;
        }
        .brand{  position:absolute;left:50%; top:0; transform: translate(-50%, -50%); }
        .brand img{ width:156px; display:block; }
        .title{
          margin: 24px 0 18px; text-align:center;
          font-weight: 800; letter-spacing:.02em;
          color: var(--txt-1);
          font-size: clamp(20px, 2.2vw, 26px);
        }
        .group{ margin-top: 14px; }
        .group small{ display:block; margin: 6px 2px 10px; color:#5f6a5f; font-weight:700; }
        .row{
          display:grid; grid-template-columns: 1fr auto; gap:10px;
          background:#fff; border: 2px solid #c9c9c9; border-radius: 14px;
          padding: 6px; align-items:center;
        }
        .input{ width:100%; height:54px; border:0; outline:0; padding: 0 14px; font-size: 16px; border-radius: 10px; }
        .add-btn{
          height: 46px; padding: 0 16px; border-radius: 12px; border:0; cursor:pointer;
          font-weight:800; color: var(--ytext);
          background-image: linear-gradient(90deg, var(--y1), var(--y2));
          box-shadow: 0 8px 14px rgba(0,0,0,.14), 0 6px 0 rgba(0,0,0,.14);
          transition: transform .06s ease, box-shadow .12s ease, filter .12s ease;
        }
        .add-btn:hover{ background-image: linear-gradient(90deg, var(--y1h), var(--y2h)); }
        .add-btn:active{ transform: translateY(2px); box-shadow: 0 4px 0 rgba(0,0,0,.18); }
        .or{ text-align:center; margin: 16px 0 6px; color:#6b6b6b; font-weight:800; }
        .chips{ display:flex; flex-wrap:wrap; gap:8px; margin:10px 2px 0; }
        .chip{
          background:#fff; border:1px solid #d7dfcd; color:#375437;
          padding: 6px 10px; border-radius: 999px; font-weight:700; display:flex; gap:8px; align-items:center;
        }
        .chip button{ appearance:none; border:0; background:transparent; cursor:pointer; font-weight:900; color:#7a1b1b; }
        .tip{
          margin-top:16px; padding: 10px 12px; border-radius: 12px;
          background: #eff8df; color:#204c20; border:1px solid rgba(0,0,0,.08);
          font-weight:700; text-align:center;
        }
        .actions{ display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:18px; }
        @media (max-width:640px){ .actions{ grid-template-columns:1fr; } }
        .btn{ height:56px; border:0; cursor:pointer; border-radius:16px; font-weight:900; font-size:16px;
          box-shadow: 0 14px 22px rgba(0,0,0,.16), 0 10px 0 rgba(0,0,0,.16); }
        .btn:disabled{ opacity:.6; cursor:not-allowed; }
        .btn-ghost{ background:#fff; border:2px solid #c9c9c9; box-shadow:0 6px 16px rgba(0,0,0,.12); }
        .btn-primary{ color:#0b1d0b; background-image: linear-gradient(90deg, var(--g1), var(--g2)); }
        .btn-primary:hover{ background-image: linear-gradient(90deg, var(--gh1), var(--gh2)); }
        .err{ color:#b00020; font-weight:800; text-align:center; margin-top:10px; }
      `}</style>

      <div className="sheet-wrap">
        <div className="sheet" role="form" aria-label="Enter Sales/Purchase Orders">
          <div className="brand">
            <img src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
          </div>

          <h2 className="title">Enter Sales/Purchase Orders</h2>

          {/* Truck ID */}
          <div className="group">
            <small>Enter Truck ID</small>
            <div className="row">
              <input
                className="input"
                placeholder="Enter Truck ID (e.g., TRK-000017011)"
                value={truckId}
                onChange={(e) => setTruckId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onContinue()}
              />
            </div>
          </div>

          <div className="or">OR</div>

          {/* Sales Orders */}
          <div className="group">
            <small>Enter Sales Order ID and press Add</small>
            <div className="row">
              <input
                className="input"
                placeholder="Enter Sales Order ID (e.g., SO-00027585)"
                value={soInput}
                onChange={(e) => setSoInput(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? addSO() : null)}
              />
              <button className="add-btn" onClick={addSO} type="button">Add</button>
            </div>
            {!!soList.length && (
              <div className="chips">
                {soList.map((id) => (
                  <span key={id} className="chip">
                    {id}
                    <button onClick={() => removeSO(id)} aria-label={`Remove ${id}`}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="or">OR</div>

          {/* Purchase Orders */}
          <div className="group">
            <small>Enter Purchase Order ID and press Add</small>
            <div className="row">
              <input
                className="input"
                placeholder="Enter Purchase Order ID"
                value={poInput}
                onChange={(e) => setPoInput(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? addPO() : null)}
              />
              <button className="add-btn" onClick={addPO} type="button">Add</button>
            </div>
            {!!poList.length && (
              <div className="chips">
                {poList.map((id) => (
                  <span key={id} className="chip">
                    {id}
                    <button onClick={() => removePO(id)} aria-label={`Remove ${id}`}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="tip">
            Enter <b>Truck ID</b> or one or more <b>Sales Order</b> or <b>Purchase Order</b> IDs.
          </div>

          <div className="actions">
            <button className="btn btn-ghost" onClick={() => nav(-1)} disabled={loading} type="button">
              Back
            </button>
            <button className="btn btn-primary" onClick={onContinue} disabled={loading} type="button">
              {loading ? "Please wait…" : "Continue"}
            </button>
          </div>

          {err && <div className="err">{err}</div>}
        </div>
      </div>
    </section>
  );
}
