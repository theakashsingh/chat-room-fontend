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
import {
  resetSelectedChat,
  setNewNotification,
} from "../../redux/features/chatSlice";
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
import Lottie from "react-lottie";
import typing_animation from "../../assets/typing_animation.json";
import { baseURL } from "../../Config/axiosInstance";

const ENDPOINT = baseURL;
let socket, selectedChatCompare;

const SingleChat = () => {
  const { selectedChat, notification } = useSelector(state => state.chat);
  const user = useSelector(state => state.auth.user);
  const newChatMessage = useSelector(state => state.message.newChatMessage);
  const messages = useSelector(state => state.message.messages);

  const dispatch = useDispatch();
  const toast = useToast();

  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOption = {
    loop: true,
    autoplay: true,
    animationData: typing_animation,

    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const sendMessage = async e => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat.value._id);
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
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const typingHandler = e => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat.value._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let currTime = new Date().getTime();
      let timeDiff = currTime - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat.value._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  useEffect(() => {
    dispatch(getMessageInChat({ selectedChat, config }));
    socket.emit("join chat", selectedChat?.value?._id);
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
    const receivedMessage = newMessageReceived => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
        if (!notification.includes(newMessageReceived)) {
          dispatch(setNewNotification(newMessageReceived));
          dispatch(getMessageInChat({ selectedChat, config }));
        }
      } else {
        dispatch(getNewMessageReceived(newMessageReceived));
      }
    };
    socket.on("message received", receivedMessage);
    return () => socket.off("message received", receivedMessage);
  });

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
              {isTyping ? (
                <div>
                  {" "}
                  <Lottie
                    options={defaultOption}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />{" "}
                </div>
              ) : (
                <></>
              )}
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
