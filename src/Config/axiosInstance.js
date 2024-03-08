import axios from "axios";

export const baseURL = "https://chit-chat-room-jfok.onrender.com"
// export const baseURL = "http://localhost:5000"

export const axiosInstance = axios.create({
  baseURL: baseURL,
});

