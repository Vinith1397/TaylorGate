// /src/kiosk/KioskFind.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PillInput from "./PillInput";
import axios from "axios";

// ✅ API call to verify orders (unchanged)
export async function checkOrders(poList, soList, driver) {
  try {
    const res = await axios.post(
      "https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net/api/Kiosk/validateorders",
      {
        driverName: driver?.name || "",
        mobileNumber: driver?.mobile || "",
        salesOrderIds: soList,
        purchaseOrderIds: poList,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error verifying orders:", err);
    throw err.response?.data || { message: "Network error" };
  }
}

export default function KioskFind() {
  const nav = useNavigate();
  const { state } = useLocation();

  // From router state or session (unchanged)
  const driverFromState = state?.driver || null;
  const otpFromState = !!state?.otpVerified;

  const storedDriver = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("kiosk.driver") || "null"); }
    catch { return null; }
  }, []);
  const storedOtp = !!sessionStorage.getItem("kiosk.otpVerified");

  const driver = driverFromState ?? storedDriver;
  const otpVerified = otpFromState || storedOtp;

  useEffect(() => {
    if (!otpVerified || !driver) nav("/kiosk", { replace: true });
  }, [otpVerified, driver, nav]);

  // 🟩 State (unchanged)
  const [poList, setPOList] = useState([]);
  const [soList, setSOList] = useState([]);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");

  const canNext = poList.length > 0 || soList.length > 0;

  // 🟩 Verify both PO & SO with backend (unchanged)
  async function onNext() {
    if (!canNext || !driver) return;

    setErr("");
    setPosting(true);

    try {
       const res = await checkOrders(poList, soList, driver);

//       const res = {
//   success: true,
//   message: `${soList.length || 2} order(s) verified successfully.`,
//   id: `REQ-${Date.now()}`,
//   salesOrders:
//     soList.length > 0 ? [soList.join(",")] : ["SO-00025988, SO-00012345"],
//   purchaseOrders: poList,
// };
      console.log("orders ", poList, soList);
      console.log("Order check result:", res);

      const ordersArray = (res.salesOrders ?? [])
        .flatMap(o => typeof o === "string" ? o.split(",").map(s => s.trim()) : [])
        .filter(Boolean);

      if (Array.isArray(res.salesOrders) && res.salesOrders.length > 0) {
        sessionStorage.setItem("kiosk.driver", JSON.stringify(driver));
        sessionStorage.setItem("kiosk.otpVerified", "true");
        nav("/kiosk/details", {
          state: {
            driver,
            orders: ordersArray,
            message: res.message || "Orders verified successfully.",
            id: res.id
          },
        });
      } else {
        setErr(res?.message || "No matching Sales/Purchase Orders found.");
      }
    } catch (e) {
      setErr(e?.message || "Unable to verify orders. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <section
      className="orders-bg"
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
          --tf-input-bg:#F4F6F0; --tf-input-border:#CFE0C5; --tf-input-focus:#A8C88E;
          --shadow-outer:rgba(0,0,0,.22); --shadow-soft:rgba(0,0,0,.10);
        }

        .orders-bg{
          background:
            radial-gradient(1200px 800px at 50% 0%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, var(--tf-green), var(--tf-green-darker));
          background-attachment: fixed;
          font-family:"Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        .sheet{
          width:min(860px, 92vw);
          position:relative;
          background:linear-gradient(130deg, var(--tf-cream), var(--tf-cream-2));
          border:4px solid var(--tf-green);
          border-radius:22px;
          box-shadow:0 18px 30px var(--shadow-outer), 0 3px 0 var(--tf-cream-edge) inset;
          padding:clamp(22px, 3.2vh, 32px);
          padding-top:64px; /* space for logo overlap */
        }

        .brand{ position:absolute; left:50%; top:0; transform:translate(-50%, -50%); }
        .brand img{ width:156px; display:block; }

        .title{
          text-align:center; color:var(--tf-title);
          font-weight:700; font-size:clamp(20px, 2.4vw, 24px); margin:0 0 14px 0;
        }

        .form{ display:grid; gap:22px; }

        .label{ display:block; font-weight:800; color:var(--tf-title); font-size:14px; margin-bottom:6px; }
        .sublabel{ font-size:12px; color:#666; margin:-2px 0 8px; }

        .field-surface{
          background:#fff; border:1px solid #D7DBCD; border-radius:14px; padding:8px;
        }

        /* unify text input look (PillInput provides inputClassName="control") */
        .control,
        .field-surface input[type="text"]{
          width:100%; height:56px; padding:0 16px;
          background:var(--tf-input-bg);
          border:2px solid var(--tf-input-border);
          border-radius:12px; font-size:16px; outline:none;
        }
        .control:focus,
        .field-surface input[type="text"]:focus{
          border-color:var(--tf-input-focus);
          box-shadow:0 0 0 3px rgba(168,200,142,.25);
          background:#fff;
        }

        /* best-effort styling for PillInput 'Add' button */
        .field-surface .pill-add,
        .field-surface button.add,
        .field-surface button.pill-add,
        .field-surface button.add-btn{
          background:#C4D82E; color:#1a3a3a; border:none;
          border-radius:12px; height:48px; padding:0 18px; font-weight:800;
          box-shadow:0 6px 16px rgba(0,0,0,.10);
        }
        .field-surface .pill-add:hover,
        .field-surface button.add:hover,
        .field-surface button.pill-add:hover,
        .field-surface button.add-btn:hover{ background:#B5C925; }

        .tf-input{
  width:100%;
  height:56px;
  padding:0 16px;
  background:#F4F6F0;
  border:2px solid #CFE0C5;
  border-radius:12px;
  font-size:16px;
  outline:none;
  box-shadow: inset 0 1px 0 rgba(0,0,0,.04);
}
.tf-input:focus{
  border-color:#A8C88E;
  box-shadow:0 0 0 3px rgba(168,200,142,.25);
  background:#fff;
}

        .center-or{ text-align:center; color:#666; font-weight:700; }

        .info{
          background:#F0F7E9; border-left:4px solid var(--tf-green);
          padding:12px 14px; border-radius:10px; color:var(--tf-title); font-size:12px; line-height:1.4;
        }

        .row{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media (max-width:640px){ .row{ grid-template-columns:1fr; } }

        .btn{
          appearance:none; border:0; cursor:pointer; width:100%; height:56px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          font-weight:900; letter-spacing:.02em;
          box-shadow:0 10px 20px rgba(0,0,0,.12);
          transition:transform .08s ease, box-shadow .12s ease, background .12s ease, opacity .12s ease;
        }
        .btn:active{ transform:translateY(2px); }
        .btn-primary{ background:linear-gradient(90deg, var(--tf-green), #8BC850); color:#fff; }
        .btn-primary:hover{ background:linear-gradient(90deg, var(--tf-green-dark), var(--tf-green)); box-shadow:0 14px 24px rgba(0,0,0,.16); }
        .btn-ghost{ background:#fff; color:var(--tf-title); border:2px solid #D7DBCD; box-shadow:none; font-weight:800; }

        .hint{ text-align:center; color:#666; font-size:12px; }
        .err{ color:#b00020; font-weight:700; text-align:center; }
      `}</style>

      <div className="sheet">
        {/* Logo like driver page */}
        <div className="brand">
          <img src="/images/taylor-farms-logo-Picsart.png" alt="Taylor Farms" />
        </div>

        <h2 className="title">Enter Sales/Purchase Orders</h2>

        <div className="form">
          {/* Sales Orders */}
          <label className="field">
            <span className="label">Enter Order IDs</span>
            <div className="sublabel">Enter Sales Order ID and press Add</div>
            <div className="field-surface">
              <PillInput
                value={soList}
                onChange={setSOList}
                placeholder="Enter Sales Order ID"
                inputClassName="control"
              />
            </div>
          </label>

          <div className="center-or">OR</div>

          {/* Purchase Orders */}
          <label className="field">
            <span className="label">Customer Purchase Order IDs</span>
            <div className="sublabel">Enter Purchase Order ID and press Add</div>
            <div className="field-surface">
              <PillInput
                value={poList}
                onChange={setPOList}
                placeholder="Enter Purchase Order ID"
                inputClassName="control"
              />
            </div>
          </label>

          {/* Info box */}
          <div className="info">
            Enter one or more Sales Order or Purchase Order IDs. Both fields are optional, but at least one is required.
          </div>

          {/* Actions (logic unchanged) */}
          <div className="row">
            <button
              className="btn btn-ghost"
              onClick={() => nav(-1)}
              style={{ borderRadius: "14px", fontWeight: 500 }}
              disabled={posting}
              type="button"
            >
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={onNext}
              disabled={!canNext || posting}
              style={{ borderRadius: "14px", fontWeight: 500 }}
              type="button"
            >
              {posting ? "Checking…" : "Continue"}
            </button>
          </div>

          {posting && <p className="hint" style={{ marginTop: 8 }}>Checking order details… please wait.</p>}
          {err && <p className="err">{err}</p>}
        </div>
      </div>
    </section>
  );
}
