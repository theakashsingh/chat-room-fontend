// import axios from "axios";
import axiosInstance from "../../Config/axiosInstence";

const messageServices = {
  sendMessage: async credentials => {
    const { newMessage, selectedChat, config } = credentials;
    const response = await axiosInstance.post(
      "api/message",
      { content: newMessage, chatId: selectedChat.value._id },
      config
    );
    return response;
  },
  getMessages: async credentials =>{
    const {selectedChat,config} = credentials
    const response = await axiosInstance.get(`api/message/${selectedChat.value._id}`,config)
    return response
  }
};

export default messageServices;
