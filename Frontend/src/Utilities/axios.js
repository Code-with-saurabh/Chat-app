import axios from "axios";
const API = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: API ? `${API}/api` :  "http://localhost:5000/api",
  withCredentials: true,
});

// REQUEST INTERCEPTOR (already hai)
instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR (NEW ADD THIS)
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refreshToken");

        const res = await axios.post(
          "http://localhost:5000/api/refresh-token",
          { refreshToken }
        );

        const newAccessToken = res.data.data.accessToken;

        sessionStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return instance(originalRequest);

      } catch (err) {
        console.log("Refresh failed → Logout user");
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
