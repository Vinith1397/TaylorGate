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
  const [loading, setLoading] = useState(false);

  // If a recent appointment exists, go straight to status
  useEffect(() => {
    const saved = Cookies.get("driverAppointment");
    if (saved) navigate(`/status/${encodeURIComponent(saved)}`);
  }, [navigate]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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
        // remember for 10 hours
        Cookies.set("driverAppointment", appointmentId, {
          expires: 3 / (24 * 60),
          sameSite: "Lax",
        });

        toast.current?.show({
          severity: "success",
          summary: "Check-In Successful",
          detail: "You are checked in successfully.",
        });

        navigate(`/status/${encodeURIComponent(appointmentId)}`);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Unexpected Response",
          detail: "The server did not confirm success.",
        });
      }
    } catch (e) {
      console.error(e);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to check in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex justify-content-center" // horizontal center only
      style={{
        // Use dynamic viewport height so iOS toolbars don't inflate the gap
        minHeight: "100dvh",
        background: "#c1ce09ff",

        // SAME, small gap on all sides + iOS safe-area support
        paddingLeft: "calc(22px + env(safe-area-inset-left))",
        paddingRight: "calc(22px + env(safe-area-inset-right))",
        paddingTop: "calc(22px + env(safe-area-inset-top))",
        paddingBottom: "calc(22px + env(safe-area-inset-bottom))",

        boxSizing: "border-box",
      }}
    >
      <Toast ref={toast} />

      <Card
        className="shadow-4 w-full"
        style={{
          maxWidth: "1100px",
          width: "100%",
          background: "#f7fae3ff",
          borderRadius: "16px",
          padding: "16px", // compact, equal inner padding
          margin: "0 auto", // keep centered in the row
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "12px" }}>
          <h2 style={{ margin: 0, color: "#000", fontWeight: 800 }}>
            {t("checkin.title")}
          </h2>
          <p style={{ margin: "6px 0 0", color: "#555" }}>
            {t("checkin.subtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="grid formgrid p-fluid" style={{ rowGap: "10px" }}>
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
            />
          </div>

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
            />
          </div>

          <div className="col-12">
            <label htmlFor="mobile" className="block mb-2 font-bold">
              {t("checkin.mobile")} 
            </label>
            <InputText
              id="mobile"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="e.g., +1 555-555-5555"
              inputMode="tel"
              className="p-inputtext-lg"
            />
          </div>
        </div>

        {/* Action */}
        <div style={{ marginTop: "12px" }}>
          <Button
            label={t("checkin.checkin")}
            icon="pi"
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
