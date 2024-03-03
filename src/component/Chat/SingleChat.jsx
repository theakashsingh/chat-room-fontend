import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedChat } from "../../redux/features/chatSlice";
import { getSender, getSenderFull } from "../../Config/ChatLogic";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useEffect, useState } from "react";
import {
  getMessageInChat,
  getNewMessageReceived,
  sendMessageInChat,
} from "../../redux/features/messageSlice";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = () => {
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const user = useSelector(state => state.auth.user);
  const newChatMessage = useSelector(state => state.message.newChatMessage);
  const messages = useSelector(state => state.message.messages);
  const dispatch = useDispatch();
  const toast = useToast();
  // const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const sendMessage = async e => {
    if (e.key === "Enter" && newMessage) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setNewMessage("");
      dispatch(sendMessageInChat({ newMessage, selectedChat, config }));
    }
  };
  const typingHandler = e => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    dispatch(getMessageInChat({ selectedChat, config }));
    // socket.emit("join chat", selectedChat?.value?._id);
    selectedChatCompare = selectedChat.value;
  }, [selectedChat.value]);

  useEffect(() => {
    if (newChatMessage?.error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to send the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  }, [newChatMessage?.error]);

  useEffect(() => {
    socket.on("message received", newMessageReceived => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        dispatch(getNewMessageReceived(newMessageReceived));
      }
    });
  }, [newChatMessage.value]);

  return (
    <>
      {selectedChat.value ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => dispatch(resetSelectedChat())}
            />
            {!selectedChat.value.isGroupChat ? (
              <>
                {" "}
                {getSender(user, selectedChat.value.users)}{" "}
                <ProfileModel
                  user={getSenderFull(user, selectedChat.value.users)}
                />{" "}
              </>
            ) : (
              <>
                {selectedChat.value.chatName.toUpperCase()}{" "}
                <UpdateGroupChatModal />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {" "}
            {messages.loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Send a message ..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
