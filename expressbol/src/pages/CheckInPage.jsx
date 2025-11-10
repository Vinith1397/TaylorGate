import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useI18n } from "../i18n/I18nProvider";

export default function CheckInPage() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { t } = useI18n();

  const [form, setForm] = useState({
    appointmentId: "",
    name: "",
    mobile: "",
    email: "",
  });

  // OTP UI state
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [validating, setValidating] = useState(false);
  const [resendIn, setResendIn] = useState(0); // seconds left to allow resend
  const [loading, setLoading] = useState(false);

  // If a recent appointment exists, go straight to status
  useEffect(() => {
    const saved = Cookies.get("driverAppointment");
    if (saved) navigate(`/status/${encodeURIComponent(saved)}`);
  }, [navigate]);

  // resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // --- OTP handlers (stub your real API here) ---
  const handleSendOtp = async () => {
    if (!form.mobile.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Mobile required",
        detail: "Please enter your mobile number.",
      });
      return;
    }
    try {
      setSendingOtp(true);
      // TODO: call your OTP send endpoint
      // await axios.post("/api/otp/send", { mobile: form.mobile })

      toast.current?.show({
        severity: "success",
        summary: "OTP sent",
        detail: "Please check your phone.",
      });
      // setResendIn(60); // block resend for 60s
    } catch (e) {
      toast.current?.show({
        severity: "error",
        summary: "Failed to send OTP",
        detail: "Please try again.",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleValidateOtp = async () => {
    if (!otp.trim()) return;
    try {
      setValidating(true);
      // TODO: call your OTP validate endpoint
      // const { data } = await axios.post("/api/otp/validate", { mobile: form.mobile, otp })
      // if (!data?.ok) throw new Error("Invalid");

      toast.current?.show({
        severity: "success",
        summary: "OTP validated",
        detail: "Verification complete.",
      });
      // continue your flow if needed
    } catch (e) {
      toast.current?.show({
        severity: "error",
        summary: "Invalid OTP",
        detail: "Please re-enter and try again.",
      });
    } finally {
      setValidating(false);
    }
  };

  // --- Existing check-in (cookie ~3 minutes for demo) ---
  const handleCheckIn = async () => {
    const { appointmentId, name, mobile, email } = form;

    if (!appointmentId || !name || !mobile) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing Fields",
        detail: "Appointment ID, Name and Mobile are required.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net/api/Appointment",
        { appointmentId, name, mobile, email: email || "" },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.message === "Success") {
        Cookies.set("driverAppointment", appointmentId, {
          expires: 15 / (24 * 60),
          sameSite: "Lax",
        });

        toast.current?.show({
          severity: "success",
          summary: "Check-In Successful",
          detail: "You are checked in successfully.",
        });

        navigate(`/status/${encodeURIComponent(appointmentId)}`);
      }
       else {
        toast.current?.show({
          severity: "warn",
          summary: "Unexpected Response",
          detail: "Appointment ID is alredy CheckedIn",
        });
      }
    } catch (e) {
      console.error(e);
      console.log("error object", e)
      console.log ( e.response.data.customerErrorMessage)

      if ( e)
      {
        toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: e.response.data.customerErrorMessage,
      });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // {ful container }
    <section
      className="flex justify-content-center"
      style={{
        minHeight: "100dvh",
        background: "#c1ce09ff",
        paddingLeft: "calc(22px + env(safe-area-inset-left))",
        paddingRight: "calc(22px + env(safe-area-inset-right))",
        paddingTop: "calc(22px + env(safe-area-inset-top))",
        paddingBottom: "calc(22px + env(safe-area-inset-bottom))",
        boxSizing: "border-box",
        
      }}
    >
      {/* Responsive rules for the two rows */}
      <style>{`
        /* desktop-wide rows inside the card */
        #rowPhone, #rowOtp {
          display: grid;
          grid-template-columns: minmax(0, 1fr) max-content; /* input grows, button fits */
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        #rowPhone .btn, #rowOtp .btn { white-space: nowrap; }

        /* stack on small phones */
        @media (max-width: 480px) {
          #rowPhone, #rowOtp { grid-template-columns: 1fr; }
          #rowPhone .btn, #rowOtp .btn { width: 100%; }
        }
      `}</style>

      <Toast ref={toast} />
        {/* light green card */}
      <Card
        className="shadow-4 w-full"
        style={{
          /* wide card like before */
          maxWidth: "1100px",
          width: "100%",
          background: "#f7fae3ff",
          borderRadius: "16px",
          padding: "24px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "16px" }}>
          <h2 style={{ margin: 0, color: "#000", fontWeight: 800 }}>
            {t("checkin.title")}
          </h2>
          <p style={{ margin: "6px 0 0", color: "#555" }}>
            {t("checkin.subtitle")}
          </p>
        </div>

        {/* Form – full width inside the card */}
        <div className="grid formgrid p-fluid" style={{ rowGap: "12px" }}>
          {/* Appointment ID */}
          <div className="col-12">
            <label htmlFor="appointmentId" className="block mb-2 font-bold">
              {t("checkin.apptId")}
            </label>
            <InputText
              id="appointmentId"
              name="appointmentId"
              value={form.appointmentId}
              onChange={handleChange}
              placeholder="e.g., 20250101-009tf"
              className="p-inputtext-lg"
              style={{ width: "100%" }}
            />
          </div>

          {/* Name */}
          <div className="col-12">
            <label htmlFor="name" className="block mb-2 font-bold">
              {t("checkin.name")}
            </label>
            <InputText
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="p-inputtext-lg"
              style={{ width: "100%" }}
            />
          </div>

          {/* Mobile + Send OTP (same row) */}
          <div className="col-12">
            <label htmlFor="mobile" className="block mb-2 font-bold">
              {t("checkin.mobile")}
            </label>
            <div id="rowPhone">
              <InputText
                id="mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="e.g., +1 555-555-5555"
                inputMode="tel"
                className="p-inputtext-lg"
                style={{ width: "100%" }}
              />
              <Button
                label="Send OTP"
                onClick={handleSendOtp}
                disabled={!form.mobile || sendingOtp || resendIn > 0}
                loading={sendingOtp}
                className="btn"
                style={{
                  background: "#D7E83E",
                  border: "2px solid #0a0a0a",
                  fontWeight: 700,
                  padding: "0.9rem 1rem",
                  color : "black"
                }}
              />
            </div>
          </div>
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  }}
>
  {/* OTP + Validate */}
  <div className="col-12" style={{ width: "100%", maxWidth: "1060px" }}>
    <label htmlFor="otp" className="block mb-2 font-bold">
      OTP
    </label>
    <div id="rowOtp">
      <InputText
        id="otp"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        inputMode="numeric"
        className="p-inputtext-lg"
        style={{ width: "100%" }}
      />
      <Button
        label="Validate OTP"
        onClick={handleValidateOtp}
        disabled={!otp}
        loading={validating}
        className="btn"
        style={{
          background: "#D7E83E",
          border: "2px solid #0a0a0a", // ← black border
          color: "#000",
          fontWeight: 700,
          padding: "0.9rem 1rem",
          borderRadius: "8px",
        }}
      />
    </div>

    {/* GEO text */}
    <p style={{ marginTop: "10px", textAlign: "center", color: "#333" }}>
      This is GEO Location Enabled Check-in Only if you are in range
    </p>
  </div>

</div>

        </div>

        {/* Action */}
        <div style={{ marginTop: "16px" }}>
          <Button
            label={t("checkin.checkin")}
            className="w-full p-button-lg"
            style={{
              background: "#D7E83E",
              border: "none",
              color: "#000",
              fontWeight: "bold",
            }}
            loading={loading}
            onClick={handleCheckIn}
          />
        </div>
      </Card>
    </section>
  );
}
