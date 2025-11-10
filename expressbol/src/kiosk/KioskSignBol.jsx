// KioskSignBol.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

const SIGN_BOL_ENDPOINT =
  "https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net/api/Admin/processbol";

const openNew = (url) => url && window.open(url, "_blank", "noopener,noreferrer");

export default function KioskSignBol() {
  const { state } = useLocation();
  const nav = useNavigate();

  // Inputs from previous page
  const query = state?.query || {};
  const truckId = (query?.truckId || "").trim();
  const appointmentId = (query?.appointmentId || "").trim(); // optional

  // Expect results with BOL URLs (e.g., r.bolUrl or r.url)
  const results = useMemo(
    () => (Array.isArray(state?.results) ? state.results : []),
    [state?.results]
  );

  // UI state
  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");
  const [signing, setSigning] = useState(false);
  const [signedLinks, setSignedLinks] = useState([]); // [{ so: "Combined", url }]

  // Signature pad
  const sigRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!results.length) nav("/kiosk", { replace: true });
  }, [results, nav]);

  // Responsive canvas sizing (no optional-chaining assignment ops)
  useEffect(() => {
    if (!boxRef.current) return;

    const resize = () => {
      const inst = sigRef.current;
      if (!inst) return;
      const canvas = inst.getCanvas?.();
      if (!canvas) return;

      const cssW = boxRef.current.clientWidth || 800;
      const cssH = Math.max(180, Math.min(320, Math.round(window.innerHeight * 0.35)));

      canvas.width = cssW;
      canvas.height = cssH;
      canvas.style.width = "100%";
      canvas.style.height = `${cssH}px`;

      // clear after resize to avoid stretched strokes
      inst.clear();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(boxRef.current);
    resize();
    return () => ro.disconnect();
  }, []);

  const hasSignature = () => !!sigRef.current && !sigRef.current.isEmpty();
  const clearSig = () => sigRef.current?.clear();

  // Submit ALL: multipart/form-data to /processbol
  const submitAllCombined = async () => {
    setErr("");
    setInfo("");

    if (!hasSignature()) {
      setErr("Please sign in the box before submitting.");
      return;
    }

    // Gather BOL links from results
    const links = (results || [])
      .map((r) => (r?.bolUrl || r?.url || "").trim().replace(/^"|"$/g, ""))
      .filter(Boolean);

    if (!links.length) {
      setErr("No BOL documents found. Load BOLs before signing.");
      return;
    }

    // Determine TruckId to send (server requires a value)
    const truck = (truckId || appointmentId || "").trim();
    if (!truck) {
      setErr("Missing Truck/Appointment ID to submit signature.");
      return;
    }

    try {
      setSigning(true);

      // Signature → PNG File
      const dataUrl = sigRef.current.toDataURL("image/png");
      const blob = await fetch(dataUrl).then((r) => r.blob());
      const file = new File([blob], "signature.png", { type: "image/png" });

      // Build FormData as API expects
      const form = new FormData();
      form.append("TruckId", truck); // required
      form.append("pngSing", file, file.name); // required (field name EXACT)
      form.append("metaJson", JSON.stringify({ BlobLinks: links })); // required JSON string

      // Debug preview (safe)
      console.group("FormData preview");
      for (const [k, v] of form.entries()) {
        console.log(
          k,
          v instanceof File ? { name: v.name, type: v.type, size: v.size } : v
        );
      }
      console.groupEnd();

      const res = await fetch(SIGN_BOL_ENDPOINT, {
        method: "POST",
        headers: { Accept: "text/plain, application/json" }, // let browser set multipart boundary
        body: form,
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || `Sign failed (${res.status}).`);
      }

      // API may return plain URL text or JSON with { blobPdfLink | BlobPdfLink }
      let combinedUrl = text;
      try {
        const maybeJson = JSON.parse(text);
        combinedUrl = maybeJson?.blobPdfLink || maybeJson?.BlobPdfLink || "";
      } catch {
        // text wasn't JSON; if it's a URL already, fine.
      }

      if (!combinedUrl && /^https?:\/\//i.test(text)) {
        combinedUrl = text;
      }

      if (!combinedUrl) {
        setInfo("Signed successfully, but no PDF URL returned.");
        return;
      }

      // Show the single combined signed PDF
      setSignedLinks([{ so: "Combined", url: combinedUrl }]);
      setInfo("Combined signed BOL generated.");
      // Optional: clear pad on success
      // sigRef.current.clear();
    } catch (e) {
      setErr(e?.message || "Could not submit signature.");
    } finally {
      setSigning(false);
    }
  };

  const printUrl = (url) => {
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
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        openNew(url);
      }
    };
    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 30000);
  };

  return (
    <section
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "min(4vh, 28px)",
        background: "#7AB844",
      }}
    >
      <style>{`
        :root{
          --outer:#7AB844;
          --cream:#fffef0; --cream2:#fdf8e1; --creamEdge:#E9E0BA;
          --cardBorder:#7AB844;
          --ink:#102a12; --ink2:#355a35;
          --pill:#0c2f1a;
          --btnTop:#FDB750; --btnBot:#FFCB69; --btnTopH:#F5A623; --btnBotH:#FDB750;
          --g1:#8BC34A; --g2:#79B73E; --g1h:#7CB342; --g2h:#6AA936;
          --panel:#eef6dc; --panelBorder:#d6e4c0;
        }
        .wrap{ width:min(1120px, 95vw); position: relative; }

        .sheet{
          background: linear-gradient(130deg, var(--cream), var(--cream2));
          border: 4px solid var(--cardBorder);
          border-radius: 24px;
          box-shadow: 0 3px 0 var(--creamEdge) inset, 0 18px 30px rgba(0,0,0,.18);
          padding: clamp(22px, 3.2vh, 32px);
          padding-top:64px;
        }
        .brand{ position:absolute; left:50%; top:0; transform: translate(-50%, -50%); }
        .brand img{ width:156px; display:block; }

        .toolbar{
          display:grid; grid-template-columns: 1fr auto; gap:10px; align-items:center;
          margin-bottom: 12px;
        }
        @media (max-width: 760px){ .toolbar{ grid-template-columns: 1fr; } }
        .search{
          display:flex; gap:10px; align-items:center; background:#fff;
          border:2px solid #c9c9c9; border-radius:12px; padding:6px 10px;
        }
        .search input{
          flex:1; height:44px; border:0; outline:0; font-size:16px; border-radius:10px; padding:0 10px;
          background:#fff;
        }
        .btn{
          height:44px; border:0; cursor:pointer; border-radius:12px; font-weight:900; padding:0 16px;
          box-shadow: 0 12px 18px rgba(0,0,0,.12), 0 8px 0 rgba(0,0,0,.12);
        }
        .btn-ghost{ background:#fff; border:2px solid #c9c9c9; }
        .btn-green{ color:#0b1d0b; background-image: linear-gradient(90deg, var(--g1), var(--g2)); }
        .btn-green:hover{ background-image: linear-gradient(90deg, var(--g1h), var(--g2h)); }
        .btn-pill{ background-image: linear-gradient(90deg, var(--btnTop), var(--btnBot)); color:#11250b; }
        .btn-pill:hover{ background-image: linear-gradient(90deg, var(--btnTopH), var(--btnBotH)); }

        .grid{ display:grid; grid-template-columns: 1.1fr 1fr; gap:16px; }
        @media (max-width: 980px){ .grid{ grid-template-columns: 1fr; } }

        .panel{
          background: var(--panel); border:2px solid var(--panelBorder);
          border-radius:16px; padding:12px;
        }
        .h{ margin:4px 0 12px; font-weight:800; color:#1a3a3a; }

        .list{ display:flex; flex-direction:column; gap:10px; }
        .row{
          background:#fff; border:1px solid #e4ecd6; border-radius:12px; padding:10px;
          display:flex; justify-content:space-between; align-items:center; gap:10px;
        }
        .actions{ display:flex; gap:8px; flex-wrap:wrap; }

        .sigwrap{ background:#fff; border:2px dashed #b7cf98; border-radius:16px; padding:8px; }
        .msg{ font-weight:800; margin-top:8px; }
        .ok{ color:#0c4b2e; } .err{ color:#b00020; }
      `}</style>

      <div className="wrap">
        <div className="sheet">
          <div className="brand">
            <img src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
          </div>

          {/* Top toolbar */}
          <div className="toolbar">
            <div className="search">
              <span style={{ fontWeight: 900, color: "#234b23" }}>
                {truckId ? "Truck" : "Orders"}
              </span>
              <input
                disabled
                value={
                  truckId ||
                  (query?.salesOrders && query.salesOrders.join(", ")) ||
                  (query?.purchaseOrders && query.purchaseOrders.join(", ")) ||
                  ""
                }
              />
              <button className="btn btn-ghost" onClick={() => nav(-1)}>
                Back
              </button>
            </div>

            <button
              className="btn btn-green"
              onClick={() => window.print()}
              title="Print page (use 'Print Signed' for the generated PDF link)"
            >
              Print
            </button>
          </div>

          <div className="grid">
            {/* Left: document list (no per-item Submit anymore) */}
            <div className="panel">
              <div className="h">Documents: {results.length} found</div>
              <div className="list">
                {results.map((r) => (
                  <div key={r.salesOrderNumber || r.id || r.bolUrl} className="row">
                    <div>
                      <div style={{ fontWeight: 800, color: "#0c2f1a" }}>
                        SO: {r.salesOrderNumber || "—"}
                      </div>
                    </div>
                    <div className="actions">
                      <button className="btn btn-ghost" onClick={() => openNew(r.bolUrl || r.url)}>
                        View BOL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {info && <div className="msg ok">{info}</div>}
              {err && <div className="msg err">{err}</div>}
            </div>

            {/* Right: signature + Submit All + signed link(s) */}
            <div className="panel">
              <div className="h">Sign Below</div>
              <div className="sigwrap" ref={boxRef}>
                <SignatureCanvas
                  ref={sigRef}
                  penColor="#0c2f1a"
                  canvasProps={{ style: { width: "100%", height: "100%", display: "block" } }}
                />
              </div>

              <div className="actions" style={{ marginTop: 10 }}>
                <button className="btn btn-ghost" onClick={clearSig}>Clear</button>
                <button
                  className="btn btn-green"
                  disabled={signing || !results.length}
                  onClick={submitAllCombined}
                  title="Submit this signature for all BOLs and get a combined signed PDF link"
                >
                  {signing ? "Submitting…" : "Submit All"}
                </button>
              </div>

              {!!signedLinks.length && (
                <>
                  <div className="h" style={{ marginTop: 16 }}>Signed BOL(s)</div>
                  <div className="list">
                    {signedLinks.map((s) => (
                      <div key={s.so + s.url} className="row">
                        <div style={{ fontWeight: 800 }}>
                          {s.so ? `SO: ${s.so}` : "Signed"}
                        </div>
                        <div className="actions">
                          <button className="btn btn-ghost" onClick={() => openNew(s.url)}>
                            View Signed
                          </button>
                          <button className="btn btn-green" onClick={() => printUrl(s.url)}>
                            Print Signed
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
