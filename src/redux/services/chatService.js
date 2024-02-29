import axios from "axios";

const chatServices = {
  selectChat: async credentials => {
    const { userId, config } = credentials;
    const response = await axios.get(`/api/chat`,{userId},config)
    console.log(response);
    return response;
  },
};

export default chatServices;
