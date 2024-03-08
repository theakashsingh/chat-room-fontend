import {axiosInstance} from "../../Config/axiosInstance";

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/api/user/login", credentials);
    return response;
  },
  signup: async (userData) => {
    const response = await axiosInstance.post("/api/user", userData);
    return response;
  },
};

export default authService;