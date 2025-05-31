import axios from "axios";
// import { url } from "inspector";
// import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:56076",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    //   // "X-XSRF-TOKEN": decodeURIComponent(
    //   //   "eyJpdiI6InhuK3ZRWlVpU2RKbVh4d1Zya1l1Smc9PSIsInZhbHVlIjoiRVM5VWpRNEJieUNSTUx5ZW9KZW9nWmN1UUE2TlZZVDltMjdSaW45WEtXZlJDNW9HVXFoZjBPV3NYcXNHZ1hIOHRPRnMyRWtvT2Y5ME16Qi9aa3dLVnRGbU81U01qVkVDelVMSTE0eVlRdVN4ODU0bTVpa2UyZ09YZnZuVUV4dmgiLCJtYWMiOiJjMDYzZmJjOGUyZWUyZWNlMDM4ODY4NTBmYTRiMjVjNjIyMDFiOTNmMTdiNzE3OTU5YzZlZTQ1ZjE4ZjlkYTg5IiwidGFnIjoiIn0%3D"
    //   // ),
  },
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

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
//   //   console.log(document.cookie);
//   const token = Cookies.get("XSRF-TOKEN");
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

export default api;
