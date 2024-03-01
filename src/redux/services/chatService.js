import axios from "axios";

const chatServices = {
  selectChat: async credentials => {
    const { userId, config } = credentials;
    const response = await axios.post(`/api/chat`,{userId},config)
    console.log(response);
    return response;
  },
  getChat:async(credentials)=>{
     const response = await axios.get(`/api/chat`,credentials)
     return response
  }
};

export default chatServices;
