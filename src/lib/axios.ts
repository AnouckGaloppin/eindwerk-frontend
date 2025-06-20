import axios from "axios";
// import { url } from "inspector";
// import Cookies from "js-cookie";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.ddev.site";

const api = axios.create({
  // baseURL: "http://localhost:61469",
  baseURL: process.env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // "X-Requested-With": "XMLHttpRequest",
  },
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Add request interceptor for logging
// api.interceptors.request.use(
//   (config) => {
//     console.log('Making request:', {
//       url: config.url,
//       method: config.method,
//       data: config.data,
//       headers: config.headers
//     });
//     return config;
//   },
//   (error) => {
//     console.error('Request error:', error);
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for logging
// api.interceptors.response.use(
//   (response) => {
//     console.log('Response received:', {
//       url: response.config.url,
//       status: response.status,
//       data: response.data
//     });
//     return response;
//   },
//   (error) => {
//     console.error('Response error:', {
//       url: error.config?.url,
//       method: error.config?.method,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data,
//       headers: error.response?.headers,
//       message: error.message,
//       stack: error.stack,
//       config: {
//         baseURL: error.config?.baseURL,
//         headers: error.config?.headers,
//         params: error.config?.params,
//         data: error.config?.data
//       }
//     });
//     return Promise.reject(error);
//   }
// );

// TODO: Re-enable authentication later
// api.interceptors.request.use(
//   async (config) => {
//     // TODO: Re-enable auth header when authentication is needed
//     // const token = localStorage.getItem("token");
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     console.error("Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// Handle response errors
// api.interceptors.response.use(
//   (response) => {
//     console.log("Response received:", {
//       url: response.config.url,
//       status: response.status,
//       data: response.data,
//     });
//     // If this is a login response and contains a token, store it
//     // if (response.config.url === "/api/login" && response.data.token) {
//     //   localStorage.setItem("sanctum_token", response.data.token);
//     // }
//     return response;
//   },
//   async (error) => {
//     if (error.response?.status === 419) {
//       // CSRF token mismatch, try to get a new one
//       try {
//         await axios.get("http://localhost:56998/sanctum/csrf-cookie", {
//           withCredentials: true,
//         });
//         // Retry the original request
//         return api(error.config);
//       } catch (retryError) {
//         return Promise.reject(retryError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;

// api.interceptors.request.use((config) => {
//   //   // console.log(
//   //   //   "Fetching CSRF token from:",
//   //   //   `${api.defaults.baseURL}/sanctum/csrf-cookie`
//   //   // );
//   //   // const response = await axios.get(
//   //   //   api.defaults.baseURL + "/sanctum/csrf-cookie",
//   //   //   {
//   //   //     withCredentials: true,
//   //   //     withXSRFToken: true,
//   //   //     xsrfCookieName: "XSRF-TOKEN",
//   //   //     xsrfHeaderName: "X-XSRF-TOKEN",
//   //   //   }
//   //   // );
//   //   // console.log("CSRF token fetched");
// const token = Cookies.get("XSRF-TOKEN");
//   //   console.log(Cookies.get("XSRF-TOKEN"));
//   if (token) {
//     config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
//     //     console.log(config.headers);
//   }

//   //   config.headers["X-XSRF-TOKEN"] = decodeURIComponent(
//   //     "eyJpdiI6IklhSWhKSnJLVG9XcHdnSXFSelN5cUE9PSIsInZhbHVlIjoiSTh3QUwwUkp5WlFRYkdwSU9tK0lwb1U2dlhRNmFFWFRDWURtenorbmNyU2pFd01wTlNtbGNWZTdTTTNRMlZxMjRDbWpJRlpUakRxdkNNTEMrOVEyeVpCVmZvV2pXaC9oa29qTW5aZEF2TzFjOFR3Z3UvcVR1akJjb05JbFB2Nk8iLCJtYWMiOiIzYzEwNjBlODA5ZGQ4YzFhZmZhZjlhMTU1NmQ5MjY3OTg4ZTE1ZTc2NTA1OTJiYWM0NDRiNWI4ZmVlMGZmYTJmIiwidGFnIjoiIn0%3D"
//   //   );
//   return config;
// });

// export default api;
