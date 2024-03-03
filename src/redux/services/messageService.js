import axios from "axios";

const messageServices = {
  sendMessage: async credentials => {
    const { newMessage, selectedChat, config } = credentials;
    const response = await axios.post(
      "api/message",
      { content: newMessage, chatId: selectedChat.value._id },
      config
    );
    return response;
  },
  getMessages: async credentials =>{
    const {selectedChat,config} = credentials
    const response = await axios.get(`api/message/${selectedChat.value._id}`,config)
    return response
  }
};

export default messageServices;
