import axios from "axios";


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