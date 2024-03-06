import axios from "axios";

axios.defaults.baseURL = "https://chit-chat-room-jfok.onrender.com"
const authService = {
  login: async (credentials) => {
    const response = await axios.post("/api/user/login", credentials);
    return response;
  },
  signup: async (userData) => {
    const response = await axios.post("/api/user", userData);
    return response;
  },
};

export default authService;