// /src/kiosk/kioskApi.js
import axios from "axios";

const BASE = "https://mojo-demo-api-dth5ccfccxbbcshb.westus-01.azurewebsites.net";

// export async function sendOtp(mobile,licenseid) {
//   // TODO: replace with your real endpoint & body shape
//   // return { requestId: "abc123" };
//   console.log( "yoia re in  sendOtp method implementation")
//   console.log("from method",mobile,licenseid)
//   const { data } = await axios.post(`${BASE}/api/Appointment/send`, { mobile :customerNumber, licenseid : licenseId });
//    console.log( "the response data is ", data.data)
//   return data; // { requestId }
 
// }

export async function sendOtp(mobile, licenseId) {
  if (!mobile) throw new Error("mobile is required");
  try {
    console.log( "from ethod", mobile,licenseId)
    const { data } = await axios.post(`${BASE}/api/Kiosk/send`,{
      customerNumber: mobile,     // ✅ EXACT field names the API expects
      licenseId: licenseId ?? "", // optional -> send empty string if missing
    });

    // Expected: { message, requestId }
    const requestId = data?.requestId;
    console.log(requestId)
    if (!requestId) throw new Error("Missing requestId in response");
    return { requestId, message: data?.message, raw: data };
  } catch (err) {
    console.error("sendOtp failed:", err);
    throw err;
  }
}

// export async function verifyOtp(requestId, code) {
//   const { data } = await axios.post(`${BASE}/api/Kiosk/otp/verify`, {
//     requestId,
//     code,
//   });
//   return data; // { verified: true }
// }\

export async function verifyOtp(requestId, code, mobile) {
  if (!requestId) throw new Error("requestId is required");
  if (!code) throw new Error("otp code is required");
  if (!mobile) throw new Error("customerNumber (mobile) is required");

  console.log("implemetation  onverify function", requestId, code, mobile)

  try {
    const { data } = await axios.post(`${BASE}/api/Kiosk/verify`, {
      customerNumber: mobile,   // ✅ as per API
      otpCode: code,            // ✅ as per API
      requestId,                // ✅ as per API
    });

   console.log( "verify data ", data)
    // Normalize for your UI
    return {
      verified: !!data?.success,
      success: !!data?.success,
      message: data?.message ?? "",
      requestId: data?.requestId ?? requestId,
      raw: data,
    };
  } catch (err) {
    console.error("verifyOtp failed:", err);
    throw err;
  }
}

// export async function kioskCheckIn(payload) {
//   // payload = { driver:{name,mobile,licenseId}, identifiers:{appointmentId?, salesOrderIds?[]}, kiosk:{deviceId,geo,source} }
//   const { data } = await axios.post(`${BASE}/api/Kiosk/check-in`, payload);
//   return data; // { status:"accepted", ticketId, message }
// }


// export async function kioskCheckIn(payload) {
//   // Common candidates; set the first one to your actual route
//   const candidates = [
//     `${BASE}/api/Appointment/kiosk/check-in`
//     // `${BASE}/api/Appointment/kiosk/checkin`,
//     // `${BASE}/api/Kiosk/checkin`,
//   ];
//   console.log( "payload from post implementation", payload)
//   let lastErr = null;
//   for (const url of candidates) {
//     try {
//       const { data } = await axios.post(url, payload);
//       console.log("data from method implemetation",data)
//       return data;
//     } catch (err) {
//       const status = err?.response?.status;
//       // if 404, try next candidate; otherwise bubble up
//       if (status !== 404) throw err;
//       lastErr = err;
//     }
//   }

//   const e = new Error(
//     "Kiosk check-in endpoint not found. Please confirm the backend route."
//   );
//   e.cause = lastErr;
//   throw e;
// }

export async function kioskCheckIn(payload) {
  // Routes your backend might expose — most production systems use one of these
  const candidates = [
    `${BASE}/api/Kiosk`,  // primary
    `${BASE}/api/Appointment/kiosk/checkin`,   // fallback
  ];

  console.log("🚀 kioskCheckIn() payload:", payload);
  let lastErr = null;

  for (const url of candidates) {
    try {
      const res = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain, application/json",
        },
        timeout: 15000, // 15s safety
      });

      console.log("✅ Success from:", url, "→", res.status, res.data);

      // normalize result
      const success =
        res?.data?.success === true ||
        res?.status === 200 ||
        res?.data?.status === "ok" ||
        res?.statusText?.toLowerCase() === "ok";

      if (success) return res.data; // ✅ all good
      else throw new Error(`Unexpected response at ${url}: ${JSON.stringify(res.data)}`);
    } catch (err) {
      const status = err?.response?.status;
      console.warn(`❌ POST failed at ${url}`, status, err?.response?.data);
      // if endpoint missing, try next
      if (status === 404) {
        lastErr = err;
        continue;
      }
      // any other error → stop and bubble up
      throw err;
    }
  }

  // none of the routes worked
  const e = new Error(
    "Kiosk check-in endpoint not found. Please confirm backend route or deployment."
  );
  e.cause = lastErr;
  throw e;
}

export async function getCheckInDetails(checkInId) {
  // Example GET. If your API is POST, change accordingly.
  const { data } = await axios.get(
    `${BASE}/api/Kiosk/checkins/${encodeURIComponent(checkInId)}`
  );
  return data;
}


export async function checkOrders(poList = [], soList = []) {
  try {
    const res = await axios.post("/api/kiosk/check-orders", {
      PurchaseOrders: poList,   // send Purchase Orders
      SalesOrders: soList,      // send Sales Orders
    });

    return res.data;
  } catch (err) {
    console.error("Error verifying orders:", err);
    throw err.response?.data || { message: "Network error" };
  }
}