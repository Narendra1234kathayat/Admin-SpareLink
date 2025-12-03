import axios from "axios";
 
export const BASE_URL = "http://localhost:5000/"; // Replace with your backend base URL
// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/", // Replace with your backend base URL
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// // RESPONSE INTERCEPTOR
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("✅ Response:", response);
//     return response;
//   },
//   (error) => {
//     console.error("❌ Response Error:", error.response || error.message);

//     if (error.response?.status === 401) {
//       // Token expired or unauthorized
//       // alert("Session expired. Please log in again.");
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response || error.message);

    const status = error.response?.status;
    const url = error.config?.url;

    // 🚫 Do NOT redirect on login failure
    if (url.includes("/api/users/login")) {
      return Promise.reject("Login failed. Please check your credentials.");
    }

    // ✅ Redirect only for other APIs
    if (status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;

