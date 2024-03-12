import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getChat, selectToChat } from "../../redux/features/chatSlice";
import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../Chat/ChatLoading";
import { formatTime, getSender, getSenderFull } from "../../Config/ChatLogic";
import GroupChatModel from "./GroupChatModel";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState("");
  const user = useSelector(state => state.auth.user);
  const chats = useSelector(state => state.chat.chats);
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const renameGroup = useSelector(state => state.chat.renameGroup);
  const addToGroup = useSelector(state => state.chat.addToGroup);
  const removeFromGroup = useSelector(state => state.chat.removeFromGroup);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleGetChat = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    dispatch(getChat(config));
  };

  useEffect(() => {
    if (chats.error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  }, [chats]);

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    handleGetChat();
  }, [renameGroup.value, addToGroup.value, removeFromGroup.value]);

  return (
    <Box
      display={{ base: selectedChat.value ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"work sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModel>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats.value ? (
          <Stack overflowY={"scroll"}>
            {chats.value.map(currChat => (
              <Box
                key={currChat._id}
                onClick={() => dispatch(selectToChat(currChat))}
                display={"flex"}
                alignItems={"center"}
                cursor={"pointer"}
                bg={
                  selectedChat.value?._id === currChat?._id
                    ? "#38B2AC"
                    : "#E8E8E8"
                }
                color={
                  selectedChat.value?._id === currChat?._id ? "white" : "black"
                }
                px={3}
                py={2}
                borderRadius={"lg"}
              >
                {console.log(currChat)}
                <Box>
                  <Avatar
                    size={"sm"}
                    src={
                      !currChat.isGroupChat
                        ? getSenderFull(loggedUser, currChat.users).pic
                        : currChat.groupAdmin.pic
                    }
                  />
                </Box>
                <Box overflow={"hidden"} pl={2} w={"100%"}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    w={"100%"}
                  >
                    <Text>
                      {!currChat.isGroupChat
                        ? getSender(loggedUser, currChat.users)
                        : currChat.chatName}
                    </Text>
                    {currChat.latestMessage && (
                      <Text>
                        {formatTime(currChat.latestMessage.createdAt)}
                      </Text>
                    )}
                  </Box>
                  <Box display={"flex"} gap={2}>
                    {currChat.latestMessage && (
                      <Text whiteSpace={"nowrap"} fontWeight={"500"}>
                        {currChat.latestMessage?.sender._id === loggedUser._id
                          ? "You :"
                          : `${currChat.latestMessage?.sender.name} :`}
                      </Text>
                    )}
                    <Text
                      overflow={"hidden"}
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                    >
                      {currChat.latestMessage &&
                        currChat.latestMessage?.content}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
