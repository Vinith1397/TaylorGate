// import { useState,useEffect } from "react";
// import { useLocation, useNavigate} from "react-router-dom";
// import { getCheckInDetails } from "./KioskApi";

// export default function KioskStatus() {
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
//         <h2 className="title"> Load Status</h2>
 
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
//         backgroundColor: "#f2f7ce", 
// // same as Driver/Find

//              }}>
                
//               <h2 style={{ margin: 0, fontWeight: 800 }}>Dock Assigned</h2>
//               <KV k="Last Status Update " v={data?.appointmentId ?? "2025-2-11"} />
//               <KV k="Next Status" v={data?.appointmentId ?? "Sign BOL"} />

//               <KV k="Appointment ID" v={data?.appointmentId ?? "—"} />
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
              
//               <KV
//                 k="Sales Orders"
//                 v={
//                   (data?.salesOrderIds && data.salesOrderIds.length > 0
//                     ? data.salesOrderIds.join(", ")
//                     : "—")
//                 }
//               />
            

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


import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCheckInDetails } from "./KioskApi";

export default function KioskStatus() {
  const nav = useNavigate();
  const [AppointmentId, setAppointmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);
  const { state } = useLocation();

  const canSearch = AppointmentId.trim().length > 0;

  async function onSearch() {
    if (!canSearch) return;
    setErr("");
    setLoading(true);
    setData(null);

    try {
      // const res = await getCheckInDetails(AppointmentId.trim());
      const res = { status: "ok" };
      const ok =
        res?.success === true ||
        res?.status === "ok" ||
        res?.status === 200 ||
        !!res?.id ||
        !!res?.AppointmentId;

      if (!ok) {
        setErr(res?.message || "No record found for that Check-In ID.");
        return;
      }
      setData(res);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to fetch details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function getPdfUrl() {
    return (
      data?.pdfUrl ||
      data?.bolPdfUrl ||
      data?.documents?.find?.((d) => /pdf/i.test(d?.mime || d?.url || ""))?.url ||
      null
    );
  }
  function viewPdf() {
    const url = getPdfUrl();
    if (!url) return setErr("No PDF available to view.");
    window.open(url, "_blank", "noopener,noreferrer");
  }
  function printPdf() {
    const url = getPdfUrl();
    if (!url) return setErr("No PDF available to print.");
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = url;
    iframe.onload = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    };
    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 30000);
  }

  const [secondsLeft, setSecondsLeft] = useState(30);
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

  return (
    <section
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "min(4vh, 28px)",
        backgroundImage: 'url("/images/panel_background.png")',
        backgroundRepeat: "repeat",
        backgroundSize: "520px auto",
        backgroundPosition: "top center",
        backgroundColor: "#f2f7ce",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        /* ===== TaylorGate theme tokens (match other pages) ===== */
        :root{
          --tg-outer: #7AB844;
          --tg-cream: #fffef0;
          --tg-cream-2: #fdf8e1;
          --tg-cream-edge: #E9E0BA;
          --tg-card-border: #7AB844;

          --tg-text-1: #1a3a3a;
          --tg-text-2: #4a5a4a;

          --tg-btn-top: #FDB750;
          --tg-btn-bottom: #FFCB69;
          --tg-btn-hover-top: #F5A623;
          --tg-btn-hover-bottom: #FDB750;
          --tg-btn-text: #1a3a3a;

          --sheet-bg: #f2f7ce;         /* fixed typo */
          --sheet-border: rgba(0,0,0,.08);
          --sheet-radius: 24px;
          --sheet-shadow: 0 10px 30px rgba(0,0,0,.15);
        }

        .sheet {
          width: min(820px, 92vw);
          background: linear-gradient(130deg, var(--tg-cream), var(--tg-cream-2));
          border: 4px solid var(--tg-card-border);
          border-radius: var(--sheet-radius);
          box-shadow: 0 3px 0 var(--tg-cream-edge) inset, var(--sheet-shadow);
          padding: clamp(20px, 3.2vh, 34px);
        }

        .title {
          margin: 0 0 14px 0;
          font-weight: 800;
          font-size: clamp(22px, 2.6vw, 28px);
          text-align: center;
          color: var(--tg-text-1);
          letter-spacing: .02em;
        }

        .form { display: grid; gap: clamp(14px, 2vh, 18px); }
        .field { display: grid; gap: 10px; }
        .label {
          font-weight: 800;
          font-size: clamp(16px, 1.8vw, 18px);
          color: var(--tg-text-2);
          letter-spacing: .02em;
        }

        .control {
          display: block; width: 100%;
          height: clamp(56px, 7vh, 64px);
          padding: 0 16px;
          font-size: clamp(18px, 2.2vw, 22px);
          line-height: 1.2;
          border: 2px solid #c9c9c9;
          border-radius: 14px;
          background: #fff;
          outline: none;
          transition: border-color .12s ease, box-shadow .12s ease;
        }
        .control:focus {
          border-color: #86B837;
          box-shadow: 0 0 0 3px rgba(134,184,55,.2);
        }

        .btn {
          appearance: none; border: 0; cursor: pointer; width: 100%;
          height: clamp(56px, 7vh, 64px);
          border-radius: 20px;
          font-size: clamp(18px, 2.2vw, 22px);
          font-weight: 900; letter-spacing: .3px;
          color: var(--tg-btn-text);
          background-image: linear-gradient(90deg, var(--tg-btn-top), var(--tg-btn-bottom));
          box-shadow: 0 14px 22px rgba(0,0,0,.18), 0 10px 0 rgba(0,0,0,.18);
          transition: transform .06s ease, filter .12s ease, opacity .12s ease, box-shadow .12s ease;
        }
        .btn:hover {
          background-image: linear-gradient(90deg, var(--tg-btn-hover-top), var(--tg-btn-hover-bottom));
          box-shadow: 0 18px 28px rgba(0,0,0,.22), 0 12px 0 rgba(0,0,0,.22);
        }
        .btn:active { transform: translateY(3px); box-shadow: 0 10px 0 rgba(0,0,0,.2); }
        .btn[disabled] { opacity: .6; cursor: not-allowed; }

        .btn-ghost {
          background: #fff;
          color: #222;
          border: 2px solid #c9c9c9;
          box-shadow: 0 6px 16px rgba(0,0,0,.12);
        }
        .btn-ghost:active { transform: translateY(1px); }

        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 640px){ .row { grid-template-columns: 1fr; } }

        .hint { text-align:center; color:#666; font-size: clamp(14px,1.8vw,16px); }
        .count { text-align:center; color:#333; font-weight: 600; }
        .err  { color: #b00020; font-weight: 700; text-align: center; }

        .card {
          background: #fff;
          border: 1px solid #e4e4e4;
          border-radius: 14px;
          padding: 14px;
        }
        .kv { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .kv .k { min-width: 160px; font-weight: 800; color: var(--tg-text-1); }
      `}</style>

      <div className="sheet">
        <h2 className="title">Load Status</h2>

        <div className="form">
          {!data && (
            <div className="form">
              <Field label="Enter Appointment ID">
                <input
                  className="control"
                  value={AppointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  placeholder="e.g., 20250101-009tf"
                />
              </Field>

              <div className="row">
                <button
                  className="btn-ghost"
                  onClick={() => nav(-1)}
                  disabled={loading}
                  style={{ borderRadius: 20, fontWeight: 700 }}
                >
                  Back
                </button>
                <button
                  className="btn"
                  onClick={onSearch}
                  disabled={!canSearch || loading}
                  style={{ borderRadius: 20 }}
                >
                  {loading ? "Searching…" : "Find"}
                </button>
              </div>

              {err && <p className="err">{err}</p>}
              {!err && (
                <p className="hint">
                  Enter your Check-In ID to view status and documents.
                </p>
              )}
            </div>
          )}

          {data && (
            <div
              className="card"
              style={{
                display: "grid",
                gap: 10,
                backgroundImage: 'url("/images/panel_background.png")',
                backgroundRepeat: "repeat",
                backgroundSize: "520px auto",
                backgroundPosition: "top center",
                backgroundColor: "#f2f7ce",
              }}
            >
              <h2 style={{ margin: 0, fontWeight: 800, color: "#1a3a3a" }}>
                Dock Assigned
              </h2>

              <KV k="Last Status Update" v={data?.lastUpdated ?? "2025-02-11"} />
              <KV k="Next Status" v={data?.nextStatus ?? "Sign BOL"} />

              <KV k="Appointment ID" v={data?.appointmentId ?? "—"} />
              <KV k="Check-In ID" v={data?.checkInId || data?.id} />
              <KV k="Checked-In At" v={fmtDateTime(data?.checkedInAt || data?.createdAt)} />

              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

              <KV
                k="Driver"
                v={formatDriver(
                  data?.driver || {
                    name: data?.driverName,
                    mobile: data?.driverMobile,
                    licenseId: data?.driverLicenseId,
                  }
                )}
              />
              <KV
                k="Sales Orders"
                v={
                  (data?.salesOrderIds && data.salesOrderIds.length > 0
                    ? data.salesOrderIds.join(", ")
                    : "—")
                }
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 20,
                }}
              >
                <button
                  className="btn"
                  style={{ borderRadius: 20, width: "auto", padding: "0 28px" }}
                  onClick={() => nav("/kiosk", { replace: true })}
                >
                  Home
                </button>
                <p className="hint">This screen will reset automatically.</p>
                <p className="count">Returning to home in {secondsLeft}s…</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <div
        style={{
          background: "#fff",
          border: "1px solid #c9c9c9",
          borderRadius: 12,
          padding: 8,
        }}
      >
        {children}
      </div>
    </label>
  );
}

function KV({ k, v }) {
  return (
    <div className="kv">
      <span className="k">{k}:</span>
      <span>{v}</span>
    </div>
  );
}

function fmtDateTime(s) {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString();
}

function formatDriver(d = {}) {
  const name = d?.name || "—";
  const phone = d?.mobile ? maskPhone(d.mobile) : "—";
  const lic = d?.licenseId ? maskId(d.licenseId) : "—";
  return `${name} • ${phone} • ${lic}`;
}
function maskPhone(p = "") {
  const digits = p.replace(/\D/g, "");
  if (digits.length < 4) return p || "—";
  return p.slice(0, -4).replace(/./g, "•") + p.slice(-4);
}
function maskId(id = "") {
  if (!id) return "—";
  if (id.length < 3) return id;
  return "•••" + id.slice(-3);
}
