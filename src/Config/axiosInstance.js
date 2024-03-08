import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chit-chat-room-jfok.onrender.com",
});
axiosInstance.interceptors.request.use(
  config => {
    if (config.url && config.url.startsWith("/api/")) {
      config.url = config.url.replace("/api/", "/");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
