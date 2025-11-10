// StatusPage.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import SignaturePad from "signature_pad";
import StatusDrawer from "../componets/StatusDrawer";

const ORDER = [
  "checked_in",
  "Packing_in_progress",
  "Dock_Assigned",
  "sign_bol",
  "admin_processing",
  "Checked_out",
];

const LABEL = {
  checked_in: "Checked-in",
  Packing_in_progress: " Pkg-in-progress",
  Dock_Assigned: "Dock-assigned",
  sign_bol: "Sign-BoL",
  admin_processing: "Shiper-processing",
  Checked_out: "Checked-out",
};

export default function StatusPage() {
  const { appointmentId } = useParams();
  const toast = useRef(null);

  const [pdfViewer, setPdfViewer] = useState({ open: false, url: "", title: "" });
  const [data, setData] = useState({});
  const [status, setStatus] = useState("checked_in");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
const prevStatusRef = useRef(status);
const isMobile = useMediaQuery("(max-width: 768px)");




  // Refs to avoid stale reads inside async/poll
  const isTransitioningRef = useRef(false);
  const statusRef = useRef(status);
  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Signature pad
  const sigCanvasRef = useRef(null);
  const sigPadRef = useRef(null);
  const [signing, setSigning] = useState(false);

  // ---- signature pad mount/resize only on sign_bol
  useEffect(() => {
    if (status !== "sign_bol") return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      penColor: "#111",
      backgroundColor: "#fff",
      throttle: 16,
    });
    sigPadRef.current = pad;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const cssWidth = canvas.parentElement?.clientWidth || 700;
      const cssHeight = Math.max(180, Math.min(260, Math.round(window.innerHeight * 0.35)));

      canvas.width = Math.floor(cssWidth * ratio);
      canvas.height = Math.floor(cssHeight * ratio);
      canvas.style.width = "100%";
      canvas.style.height = `${cssHeight}px`;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      pad.clear();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (typeof pad.off === "function") pad.off();
    };
  }, [status]);


  // hooks/useMediaQuery.js (or inline)
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange(); // set initial
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

  useEffect(() => {
  if (!isMobile) return;                 // only on phones
  if (status !== prevStatusRef.current) {
    setDrawerOpen(true);
    const t = setTimeout(() => setDrawerOpen(false), 2500);
    prevStatusRef.current = status;
    return () => clearTimeout(t);
  }
}, [status, isMobile]);

  const SIGN_BOL_ENDPOINT =
    "https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net/api/Appointment/process-bol";

  const handleClearSignature = () => sigPadRef.current?.clear();

  function dataUrlToBlob(dataUrl) {
    const [meta, base64] = dataUrl.split(",");
    const mime = meta.match(/data:(.*?);base64/)[1] || "image/png";
    const bytes = atob(base64);
    const len = bytes.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  const handleSubmitSignature = async () => {
    const signBolLink =
      view.links.find((l) => l.kind === "viewUnsigned")?.href || data?.signBOL?.blobUrl;

    if (!signBolLink) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing BOL",
        detail: "No BOL PDF found to sign.",
      });
      return;
    }
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      toast.current?.show({
        severity: "info",
        summary: "Signature Required",
        detail: "Please sign inside the box before submitting.",
      });
      return;
    }

    setSigning(true);
    try {
      const dataUrl = sigPadRef.current.toDataURL("image/png");
      const blob = dataUrlToBlob(dataUrl);
      const form = new FormData();
      form.append("AppointmentId", appointmentId);
      form.append("SignedPngFile", blob, "signature.png");

      const res = await axios.post(SIGN_BOL_ENDPOINT, form, {});
      console.log("SIGN_BOL response:", res.status, res.data);
      console.log(res.data.message);

      if (res.data.message === "Signed BOL uploaded successfully") {
        console.log("Signature submitted → moving UI to admin_processing");
        // Prevent fetchStatus() overwrite
        setIsTransitioning(true);
        setStatus("admin_processing");
        // Give backend time to catch up (adjust as needed)
        setTimeout(() => setIsTransitioning(false), 10000);
        // OPTIONAL: gentle delayed refresh (keeps guards)
        setTimeout(fetchStatus, 1200);
      }

      toast.current?.show({
        severity: "success",
        summary: "BOL Submitted",
        detail: "Your signature has been submitted.",
      });
      sigPadRef.current.clear();
      // IMPORTANT: do NOT fetch immediately here (we do a delayed one above)
    } catch (e) {
      console.error(e);
      toast.current?.show({
        severity: "error",
        summary: "Submit Failed",
        detail: "Could not submit signature. Please try again.",
      });
    } finally {
      setSigning(false);
    }
  };

  const handleDownload = async (url, fallbackName = "BOL.pdf") => {
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Network error");
      const blob = await res.blob();

      // filename from Content-Disposition if present
      let filename = fallbackName;
      const cd = res.headers.get("content-disposition");
      if (cd) {
        const m = cd.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
        if (m && m[1]) filename = decodeURIComponent(m[1].replace(/"/g, ""));
      }

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error(e);
      toast.current?.show({
        severity: "error",
        summary: "Download failed",
        detail: "Could not download the BOL. Please try again.",
      });
    }
  };

  const activeIndex = useMemo(
    () => Math.max(0, ORDER.indexOf(status)),
    [status]
  );

  const theme = { done: "#86b837", gray: "#d9d9d9", primary: "#c1ce09" };

  const fetchStatus = async () => {
    try {
      const res = await axios.get(
        `https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net/api/Appointment/status/${encodeURIComponent(
          appointmentId
        )}`
      );
      const payload = res?.data ?? {};
      setData(payload);
      const mapped = normalizeStatus(payload.status);
      console.log("status from get ", payload.status);

      // If UI already advanced locally, and backend hasn't caught up, don't downgrade
      // if (statusRef.current === "admin_processing" && payload.status !== "AdminProcessing") {
      //   console.log("Keep UI ahead: already admin_processing, backend not yet");
      //   return;
      // }
      if (statusRef.current === "admin_processing") {
  if (payload.status === "SignBOL" || payload.status === "DockAssigned") {
    console.log("Skipping backward overwrite from backend");
    return;
  }
}

      // Also skip overwrite while in the protected window
      if (isTransitioningRef.current) {
        console.log("Skipping backend overwrite — UI is ahead (admin_processing)");
        return;
      }
      setStatus( "admin_processing")

      // Otherwise follow backend
      // if (payload.status === "AdminProcessing") {
      //   setStatus("admin_processing");
      // } else {
      //   setStatus(mapped ?? "checked_in");
      // }
      
    } catch {
      toast.current?.show({
        severity: "warn",
        summary: "Network Error",
        detail: "Couldn't refresh status. Retrying...",
      });
    }
  };

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 8000);
    return () => clearInterval(id);
  }, [appointmentId]);

  const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

  // Build ONLY the fields/links/banner you want to show for the current stage
  const view = buildStageView(status, data, fmt);

  // Progress track math
  const TRACK_LEFT = 33;   // space for first circle
  const TRACK_RIGHT = 73;  // space for last circle + padding
  const progress = ORDER.length > 1
    ? Math.min(1, Math.max(0, activeIndex / (ORDER.length - 1)))
    : 1;

  const OUTER_PAD = 22;

  const openPdf = (url, title) => setPdfViewer({ open: true, url, title });
  //const openpdf1 = (url, title) => setPdfViewer({ open: false, url, title });
  const closePdf = () => setPdfViewer({ open: false, url: "", title: "" });

  return (
    <section
      className="page"
      style={{
        minHeight: "100lvh",

        background: theme.primary,
        paddingLeft: `calc(${OUTER_PAD}px + env(safe-area-inset-left))`,
        paddingRight: `calc(${OUTER_PAD}px + env(safe-area-inset-right))`,
        paddingTop: `calc(${OUTER_PAD}px + env(safe-area-inset-top))`,
        paddingBottom: `calc(${OUTER_PAD}px + env(safe-area-inset-bottom))`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflowX: "clip",

      }}
    >
    <style>{`
  /* Container for rows */
  .status-rows {
    display: grid;
    gap: 6px;
    width: 100%;
  }

  /* Each row: desktop → two columns */
  .status-row {
    display: grid;
    grid-template-columns: 360px 1fr;
    align-items: center;
    font-size: 1.1rem;
    color: #111;
    line-height: 1.5;
  }

  .status-row .label {
    font-weight: 600;
    white-space: nowrap;
    padding-right: 8px;
  }

  .status-row .value {
    overflow-wrap: anywhere;
  }

  /* ---- Mobile View ---- */
  @media (max-width: 480px) {
    .status-row {
      grid-template-columns: 1fr 1fr; /* stack */
      font-size: 0.8rem;
    }
    .status-row .label {
      margin-bottom: 4px;
      display: block;
    }
  }
    /* ===== Slide-in status drawer (overlay) ===== */
.drawer{
  position: fixed;
  left: 0;
  top: calc(env(safe-area-inset-top) + 56px); /* below your black header */
  bottom: calc(env(safe-area-inset-bottom) + 8px);
  width: min(72vw, 280px);                     /* responsive width */
  z-index: 1000;
  transform: translateX(calc(-100% + var(--peek, 12px))); /* keep a small peek */
  transition: transform 240ms cubic-bezier(.2,.8,.2,1);
  pointer-events: none;                        /* don't block page when closed */
}
.drawer--open{
  --peek: 0px;
  transform: translateX(0);
  pointer-events: auto;                        /* clickable when open */
}
.drawer .panel{
  height: 100%;
  background: #fff;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  border-right: 4px solid #C1CE09;
  box-shadow: 0 6px 20px rgba(0,0,0,.25);
  padding: 12px 14px 12px 10px;
  overflow: auto;
}
.drawer-h{
  display:flex; align-items:center; justify-content:space-between;
  margin: 2px 0 8px; font-size: 1rem; font-weight: 800;
}
.drawer .close{
  appearance:none; border:none; background:transparent;
  font-size: 24px; line-height:1; padding: 4px 8px; cursor:pointer;
}
.drawer-backdrop{
  position: fixed; inset: 0; background: rgba(0,0,0,.12);
  z-index: 999; backdrop-filter: blur(1px);
}

/* Optional: small toggle button that floats on the edge */
.drawer-toggle{
  position: fixed; left: 6px;
  top: calc(env(safe-area-inset-top) + 12px + 56px);
  z-index: 1001;
  border: none; border-radius: 999px;
  background: #D7E83E; color: #000; font-weight: 800;
  padding: 8px 10px; font-size: 16px;           /* >=16 to avoid iOS zoom */
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
}

/* ===== Timeline bits reused inside drawer ===== */
.timeline{ --prog:0; position:relative; padding-left:36px; margin:4px 0 10px; }
.timeline::before{
  content:""; position:absolute; left:16px; top:8px; bottom:8px; width:4px;
  background:#e5e7eb; border-radius:4px;
}
.timeline::after{
  content:""; position:absolute; left:16px; top:8px; bottom:8px; width:4px;
  background:#86B837; border-radius:4px;
  transform-origin: top; transform: scaleY(var(--prog));
}
.tl-step{ position:relative; min-height:42px; display:flex; align-items:center; gap:10px; }
.tl-bullet{ position:absolute; left:9px; width:16px; height:16px; border-radius:50%; background:#fff; border:3px solid #bbb; }
.tl-step.done .tl-bullet{ background:#86B837; border-color:#4d6f1d; }
.tl-label{ font-size:1rem; font-weight:600; color:#111; overflow-wrap:anywhere; margin-left:30px; }
.tl-step.current .tl-label{ font-weight:800; }

@media (prefers-reduced-motion: reduce){ .drawer{ transition:none; } }

/* put this in your <style> block */
.desktop-only { display: none; }
.mobile-only  { display: block; }

@media (min-width: 769px){
  .desktop-only { display: block; }
  .mobile-only  { display: none;  }
}

`}</style>


      <Toast ref={toast} />

      {/* wrapper centers the card and lets it grow to bottom */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", minHeight: 0 }}>
        <Card
          className="card"
          style={{
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: 16,
            background: "#f7fae3",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            minHeight: 0,
          }}
        >
          <header style={{ textAlign: "center", margin: "16px 16px 8px" }}>
            <h2 style={{ margin: 0, color: "#000" }}>Loading Status</h2>
            <small>
              Appointment Id: <b>{appointmentId}</b>
            </small>
          </header>

   <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: 0 }}> 
                 {/* === Vertical Stage Timeline === */}
                  {/* Desktop / Laptop: horizontal progress bar */}
  {!isMobile && (
    <div
      className="minw0"
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "8px 4px 12px",
        overflowX: "auto",
        padding: "0 8px 8px 8px",
        boxSizing: "border-box",
        minWidth: 0,
      }}
      aria-label="Progress"
    >
      {/* Base line */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: `${TRACK_LEFT}px`,
          right: `${TRACK_RIGHT}px`,
          height: 3,
          background: theme.gray,
          zIndex: 0,
        }}
      />
      {/* Filled portion */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: `${TRACK_LEFT}px`,
          width: `calc((100% - ${TRACK_LEFT + TRACK_RIGHT}px) * ${progress})`,
          height: 3,
          background: theme.done,
          zIndex: 1,
          transition: "width 0.4s ease",
        }}
      />
      {ORDER.map((step, i) => {
        const isDone = i <= activeIndex;
        const isActive = i === activeIndex;
        return (
          <div
            key={step}
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 60,
              flexShrink: 0,
              marginRight: 20,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: `3px solid ${isDone || isActive ? theme.done : theme.gray}`,
                background: isDone ? theme.done : "#fff",
                color: isDone ? "#fff" : "#666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 14,
                transition: "all 0.3s ease",
              }}
            >
              {isDone ? "✓" : i + 1}
            </div>
            <small
              style={{
                marginTop: 8,
                fontSize: "0.8rem",
                color: "#000",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {LABEL[step]}
            </small>
          </div>
        );
      })}
    </div>
  )}

   {isMobile && (
    <button
      type="button"
      className="drawer-toggle"
      onClick={() => setDrawerOpen(o => !o)}
      aria-label="Show status"
      style={{width : "50px", height : "50px"}}
    >
      •••
    </button>
  )}
            {/* Scrollable content area inside the card */}
            {/*Card container */}
            <Card
            
              style={{
                position : "relative",
                borderRadius: 16,
                background: "#ffffff",
                padding: 0,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderTop: "6px solid #C1CE09",
                boxSizing: "border-box",
                //minHeight: "150vh",
                minHeight: "80dvh",
                flex: 1,
                overflow: "hidden",
               
              }}
            >

              {/* === Vertical Timeline Track (NOT taking width) === */}
  {/* <div
    style={{
      position: "absolute",
      left: 18,
      top: 40,
      bottom: 40,
      width: 3,
      background: "#d9d9d9",
      borderRadius: 3,
      pointerEvents: "none",
    }}
  /> */}

  {/* === Timeline Steps (also overlayed, zero width impact) ===
  {ORDER.map((step, idx) => {
    const done = idx <= activeIndex;
    return (
      <div
        key={step}
        style={{
          position: "absolute",
          left: 10,
          top: `${idx * 60 + 42}px`,
          display: "flex",
          alignItems: "center",
          gap: 20,
          pointerEvents: "none", // ✅ do not block touches
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: done ? "#86B837" : "#ffffff",
            border: done ? "3px solid #4d6f1d" : "3px solid #bbb",
          }}
        />
        <span
          style={{
            fontSize: "1rem",     // ✅ prevents iOS zoom
            fontWeight: done ? 700 : 500,
            color: done ? "#000" : "#6d6d6d",
            whiteSpace: "nowrap",
          }}
        >
          {}
        </span>
      </div>
    );
  })} */}
              <div className="cardScroll">
                {/*statusTitle and buttons*/}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                    flexWrap: "wrap",
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  {/* Status title  */}
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      color: "#000",
                      display: "block",
                      fontWeight: 700,
                      fontSize: "1.85rem",
                      fontFamily:
                        'system-ui, -apple-system, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
                    }}
                  >
                    {LABEL[status]}
                  </h3>

                  {/* Stage links */}
                  {/* viewbol */}
                  {view.links.length > 0 && (
                    <div style={{ marginTop: 14, display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {view.links.map((lnk) => {
                        const commonStyle = {
                          background: "#D7E83E",
                          border: "1px solid #C1CE09",
                          color: "#000",
                          fontWeight: 400,
                          fontSize: "2rem",
                          padding: "8px 14px",
                          lineHeight: "1.2",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        };

                        if (lnk.kind === "viewUnsigned") {
                          return (
                            <Button
                              key={lnk.href}
                              label={lnk.text}
                              icon="pi"
                              className="p-button-sm"
                              onClick={() => openPdf(lnk.href, lnk.text)}
                              style={{ ...commonStyle, minWidth: "280px" }}
                              pt={{
                                label: { style: { fontWeight: 400 } },
                                icon: { style: { fontWeight: 400 } },
                              }}
                            />
                          );
                        }
                        if (lnk.kind === "viewSigned") {
                          return (
                            <Button
                              key={lnk.href}
                              label={lnk.text}
                              icon="pi pi-eye"
                              className="p-button-sm"
                              onClick={() => openPdf(lnk.href, lnk.text)}
                              style={{ ...commonStyle, minWidth: "280px" }}
                              pt={{
                                label: { style: { fontWeight: 400 } },
                                icon: { style: { fontWeight: 400 } },
                              }}
                            />
                          );
                        }

                        if (lnk.kind === "downloadSigned") {
                          return (
                            <div key={lnk.href}>
                              <Button
                                label={lnk.text}
                                icon="pi pi-download"
                                className="p-button-sm"
                                onClick={() => openPdf(lnk.href, lnk.text)}
                                style={commonStyle}
                                pt={{
                                  label: { style: { fontWeight: 400 } },
                                  icon: { style: { fontWeight: 400 } },
                                }}
                              />
                            </div>
                          );
                        }

                        return (
                          <div key={lnk.href}>
                            <Button
                              label={lnk.text}
                              icon="pi pi-external-link"
                              className="p-button-sm"
                              onClick={() => window.open(lnk.href, "_blank", "noopener,noreferrer")}
                              style={commonStyle}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                 {/*Banner mesage */}
                {view.banner && (
                  <div
                    style={{
                      margin: "8px 0 14px",
                      padding: "0px 0px",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    {view.banner}
                  </div>
                )}

        {/* Vertical details list */}
        <div className="status-rows">
          {view.rows.map((row) => (
            <div className="status-row" key={row.key}>
              <span className="label">{row.label}</span>
              <span className="value">{row.value}</span>
            </div>
          ))}
        </div>

               

                {/* Signature UI */}
                {status === "sign_bol" && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 8, fontWeight: 600, textAlign: "center" }}>
                      Sign Here
                    </div>

                    <div
                      style={{
                        position: "relative",
                        border: "2px solid #050505",
                        background: "#fff",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <button
                        type="button"
                        aria-label="Clear signature"
                        onClick={handleClearSignature}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: "1px solid #0c0c0c",
                          color: "#86B837",
                          background: "#fff",
                          display: "grid",
                          placeItems: "center",
                          cursor: "pointer",
                        }}
                        title="Clear"
                      >
                        ×
                      </button>

                      <canvas
                        ref={sigCanvasRef}
                        style={{
                          display: "block",
                          width: "100%",
                          height: 240,
                          background: "#fffef9",
                          touchAction: "none",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginTop: 12,
                      }}
                    >
                      <Button
                        type="button"
                        label="Clear"
                        className="p-button-outlined p-button-sm"
                        onClick={handleClearSignature}
                        style={{
                          flex: "1 1 220px",
                          borderColor: "#C1CE09",
                          color: "#6a6a6a",
                          fontWeight: 700,
                          background: "#fff",
                          fontSize: 16, // avoid iOS zoom
                        }}
                      />
                      <div style={{ marginLeft: "auto" }} />
                      <Button
                        type="button"
                        label={signing ? "Signing…" : "Sign BOL"}
                        icon="pi pi-check"
                        onClick={handleSubmitSignature}
                        disabled={signing}
                        className="p-button-sm"
                        style={{
                          flex: "1 1 220px",
                          background: "#D7E83E",
                          border: "1px solid #080808",
                          color: "#000",
                          fontWeight: 700,
                          opacity: signing ? 0.7 : 1,
                          cursor: signing ? "not-allowed" : "pointer",
                          fontSize: 16, // avoid iOS zoom
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
         </div> 
        </Card>
      </div>

      {/* PDF modal */}
      {/* <Dialog
        header={pdfViewer.title || "Document"}
        visible={pdfViewer.open}
        onHide={closePdf}
        style={{ width: "90vw", maxWidth: 1400 }}
        maximizable
        modal
        contentStyle={{ padding: 0 }}
        breakpoints={{ "1200px": "92vw", "960px": "96vw", "640px": "100vw" }}
      >
        {pdfViewer.url ? (
          <div style={{ width: "100%", height: "85dvh" }}>
            <iframe
              src={pdfViewer.url}
              title="PDF Viewer"
              style={{ width: "100%", height: "80vh", border: 0 }}
            />
          </div>
        ) : null}
      </Dialog> */}

      {/* <Dialog
  header={pdfViewer.title || "Document"}
  visible={pdfViewer.open}
  onHide={closePdf}
  style={{
    width: "100vw",          // full viewport width
    height: "100vh",         // full viewport height
    maxWidth: "100vw",
    margin: 0,
    padding: 0,
  }}
  modal
  dismissableMask
  contentStyle={{
    padding: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  }}
  breakpoints={{
    "1400px": "100vw",
    "960px": "100vw",
    "640px": "100vw",
  }}
>
  {pdfViewer.url ? (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 60px)", // adjust for header bar
        overflow: "hidden",
      }}
    >
      <iframe
        src={pdfViewer.url}
        title="PDF Viewer"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  ) : null}
</Dialog> */}

<Dialog
  header={pdfViewer.title || "Document"}
  visible={pdfViewer.open}
  onHide={closePdf}
  style={{ width: "160vw", maxWidth: "160vw" }}
  modal
  contentStyle={{ padding: 0 }}
>
  {pdfViewer.url && (
    <iframe
      src={pdfViewer.url}
      title="PDF Viewer"
      style={{
        width: "100%",     // occupy full width of the dialog
        height: "100vh",   // use full viewport height
        border: "none",    // clean edges
      }}
    />
  )}
</Dialog>



{isMobile && (
  <StatusDrawer
    open={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    status={status}
    order={ORDER}
    labels={LABEL}
    activeIndex={activeIndex}
  />
)}


    </section>
  );
}

/* ---------- Helpers ---------- */

function isNilOrEmpty(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  return false;
}

// Formats ISO-like strings safely; otherwise returns "—" for empty or the original if not a valid date.
function fmtSafe(isoLike) {
  if (!isoLike) return "—";
  const t = Date.parse(isoLike);
  if (Number.isNaN(t)) return isoLike; // not a real ISO date; just show as-is
  return new Date(t).toLocaleString();
}

// Some API fields like "50400" may be durations / not ISO dates; try parse else return as-is.
function passthroughOrDate(v) {
  if (!v) return "TO BE ASSIGNED";
  const t = Date.parse(v);
  if (Number.isNaN(t)) return String(v); // not a date -> show raw
  return new Date(t).toLocaleString();
}

function normalizeStatus(s) {
  if (!s) return null;
  const x = String(s).trim().toLowerCase();
  const map = {
    checkedin: "checked_in",
    "checked-in": "checked_in",
    packinginprogress: "Packing_in_progress",
    "packing-in-progress": "Packing_in_progress",
    dockassigned: "Dock_Assigned",
    "dock-assigned": "Dock_Assigned",
    signbol: "sign_bol",
    "sign-bol": "sign_bol",
    adminprocessing: "admin_processing",
    "admin-processing": "admin_processing",
    checkedout: "Checked_out",
    "checked-out": "Checked_out",
  };
    const key = x.replace(/[^a-z]/g, "");
  return map[key] ?? null;
}

/**
 * Return { banner, lastUpdate, rows, links } tailored to the current stage.
 */
function buildStageView(status, data, fmt) {
  const ci  = data?.checkIn || {};
  const pip = data?.packingInProgress || {};
  const da  = data?.dockAssigned || {};
  const sgn = data?.signBOL || {};
  const ap  = data?.adminProcessing || {};
  const co  = data?.checkOut || {};

  const STAGE_POS = {
    checked_in: 0,
    Packing_in_progress: 1,
    Dock_Assigned: 2,
    sign_bol: 3,
    admin_processing: 4,
    Checked_out: 5,
  };
  const CUR_POS = STAGE_POS[status] ?? 0;

  const useField = (fieldStagePos, value, placeholder) =>
    (fieldStagePos <= CUR_POS ? (isNilOrEmpty(value) ? placeholder : value) : placeholder);

  const FIELDS = [
    { key: "appointmentId", label: "Appointment Id:", stagePos: -1, getter: d => d?.appointmentId, placeholder: "—", fmt: id => id ?? "—" },
    //{ key: "appointmentInTime",   label: "Appointment Time",    stagePos: 2, getter: () => da.appointmentInTime,   placeholder: "TO BE ASSIGNED", fmt: passthroughOrDate },

    // Checked-In
    { key: "appointmentInTime",   label: "Appointment Time:",    stagePos: 0, getter: () => ci.appointmentInTime,   placeholder: "TO BE ASSIGNED", fmt: fmtSafe },
    { key: "checkInTime",   label: "Check-in Time:",        stagePos: 0, getter: () => ci.checkInTime,       placeholder: "TO BE ASSIGNED", fmt: fmtSafe },
    { key: "checkOutTime",  label: "Check-out Time:",       stagePos: 5, getter: () => co.checkOutTime,      placeholder: "—", fmt: fmtSafe },
    { key: "carrier",       label: "Carrier Name:",         stagePos: 0, getter: () => ci.carrier,           placeholder: "—" },
    { key: "customerName",  label: "Customer Name:",        stagePos: 0, getter: () => ci.customerName,      placeholder: "—" },

    // Packing in progress
    { key: "salesOrderId",  label: "Sales Order Id:",       stagePos: 1, getter: () => pip.salesOrderId,     placeholder: "TO BE ASSIGNED" },
    { key: "packingSlipId", label: "Packing Slip Id:",      stagePos: 1, getter: () => pip.packingSlipId,    placeholder: "TO BE ASSIGNED" },

    // Dock assigned
    { key: "bolNo",               label: "Bol No:",                 stagePos: 2, getter: () => da.bolNo,               placeholder: "TO BE ASSIGNED" },
    { key: "dockDoor",            label: "Dock Door No:",           stagePos: 2, getter: () => da.dockDoor,            placeholder: "TO BE ASSIGNED" },
    ...(status === "admin_processing"
    ? [
        {
          key: "eta",
          label: "ETA",
          stagePos: 4,
          getter: () => ap.eta,
          placeholder: "—",
        },
      ]
    : [])
//     {
//   key: "eta",
//   label: "ETA",
//   stagePos: 4,                      // corresponds to admin_processing
//   getter: () => ap.eta,             // from adminProcessing section
//   placeholder: "—"
// }
  ];

  const rows = FIELDS.map(def => {
    const raw = def.getter(data);
    const val = useField(def.stagePos, raw, def.placeholder);
    const out = def.fmt ? def.fmt(val) : val;
    return { key: def.key, label: def.label, value: out };
  });

  const { checkIn: ci2 = {}, dockAssigned: da2 = {}, checkOut: co2 = {} } = data || {};
  let lastUpdate = "—";
  if (CUR_POS >= 5)      lastUpdate = fmtSafe(co2.checkOutTime);
  else if (CUR_POS >= 2) lastUpdate = fmtSafe(da2.assignedTime || da2.appointmentOutTime || da2.appointmentInTime);
  else                   lastUpdate = fmtSafe(ci2.checkInTime);

  let banner = "";
  const links = [];

  if (status === "checked_in") {
 //You're checked in. Please wait for packing to begin.
    banner = "✅ Checked In Successfully!You’re now in the queue. Please wait while our team prepares your shipment for packing. 🚛";
  }

  if (status === "Packing_in_progress") {
   // banner = "Hey, your packing is in progress.";
   banner = "📦 Packing in Progress.....Your shipment is being prepared and verified. We’ll notify you once it’s ready for dock assignment. ⏳"
  }

  if (status === "Dock_Assigned") {
    //banner = "Dock assigned. Proceed as instructed.";
    banner = "🚚 Dock Assigned!Please proceed to your assigned dock area as instructed. Our team will guide you for loading. 🅿️"
    console.log("This isthe  DA Blob URl",da.blobUrl)
    if (da.blobUrl)
      links.push({
        kind: "viewUnsigned",
        text: "View BOL",
        href: da.blobUrl,
      });
  }

  if (status === "sign_bol") {
    //banner = "Please review and sign your BOL.";
    banner = "✍️ Scroll down to Sign Your BOL below.Please review your Bill of Lading and sign electronically to proceed. Tap below to open the document. 🖋️.  This is GEO Location enabled Please sign BOL only if you are near Truck Station"
    const unsignedUrl = sgn.blobUrl || "";
    if (unsignedUrl)
      links.push({
        kind: "viewUnsigned",
        text: "View BOL",
        href: unsignedUrl,
      });
  }

  if (status === "admin_processing") {
    banner = "🕓 Admin Review in Progress. Your signed BOL has been received. Our admin team is verifying and processing it. Please hold on. 🧾";
  }

  if (status === "Checked_out") {
    banner = "🎉 You’re Checked Out!. Thank you for completing the process. Have a safe trip and drive carefully. 🚛💨";
    if (co.blobUrl) links.push({ kind: "viewSigned",     text: "View BOL",     href: co.blobUrl });
    if (co.bolDownloadLink) links.push({ kind: "downloadSigned", text: "Download BOL", href: co.bolDownloadLink });
  }

  return { banner, lastUpdate, rows, links };
}
