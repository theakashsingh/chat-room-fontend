import axios from "axios";

const chatServices = {
  selectChat: async credentials => {
    const { userId, config } = credentials;
    const response = await axios.post(`/api/chat`, { userId }, config);
    console.log(response);
    return response;
  },
  getChat: async credentials => {
    const response = await axios.get(`/api/chat`, credentials);
    return response;
  },
  createGroup: async credentials => {
    const { groupChatName, selectedUsers, config } = credentials;
    const response = await axios.post(
      "api/chat/group",
      {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map(u => u._id)),
      },
      config
    );
    return response;
  },
  renameGroup: async credentials => {
    const { groupChatName, selectedChat, config } = credentials;
    const response = await axios.put(
      "api/chat/rename",
      { chatId: selectedChat.value._id, chatName: groupChatName },
      config
    );
    return response;
  },
  addToGroup: async credentials => {
    const { selectedChat, userToAdd, config } = credentials;
    const response = await axios.put(
      "api/chat/groupadd",
      { chatId: selectedChat.value._id, userId: userToAdd._id },
      config
    );
    return response;
  },
  removeFromGroup: async credentials => {
    const { selectedChat, userToRemove, config } = credentials;
    const response = await axios.put(
      "api/chat/groupremove",
      { chatId: selectedChat.value._id, userId: userToRemove._id },
      config
    );
    return response;
  },
};

export default chatServices;
