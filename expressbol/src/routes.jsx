import { Route, Routes, Navigate } from "react-router-dom";
import CheckInPage from "./pages/CheckInPage.jsx";
import SignaturePage from "./pages/SignaturePage.jsx";
import StatusPage from "./pages/StatusPage.jsx";


// Kiosk
import KioskLayout from "./kiosk/KioskLayout.jsx";
import KioskHome from "./kiosk/KioskHome.jsx";
import KioskDriver from "./kiosk/KioskDriver.jsx";
import KioskFind from "./kiosk/KioskFind.jsx";
import KioskDetails from "./kiosk/KioskDetails.jsx"
import KioskReview from "./kiosk/KioskReview.jsx"
import KioskDone from "./kiosk/KioskDone.jsx";
import KioskReturning from "./kiosk/KioskReturning.jsx";
import KioskStatus from "./kiosk/KioskStatus.jsx"
import KioskSignBol from "./kiosk/KioskSignBol.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<CheckInPage />} /> */}
      <Route path="/" element={<Navigate to="/kiosk" replace />} />
      <Route path="/check-in" element={<CheckInPage />} />
      <Route path="/status/:appointmentId" element={<StatusPage />} />
      <Route path="/sign/:appId" element={<SignaturePage />} />
        {/* Kiosk flow */}
      <Route path="/kiosk" element={<KioskLayout />}>
        <Route index element={<KioskHome />} />
        <Route path="driver" element={<KioskDriver />} />
        <Route path="find" element={<KioskFind />} />
        <Route path="done" element={<KioskDone />} />
        <Route path="return" element={<KioskReturning />} />
        <Route path="status" element={<KioskStatus />} />
        <Route path="details" element={<KioskDetails />} />
        <Route path="review" element={<KioskReview />} />
        <Route path="signbol" element={<KioskSignBol />} />
        
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
