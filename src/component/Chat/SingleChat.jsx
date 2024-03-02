import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedChat } from "../../redux/features/chatSlice";
import { getSender, getSenderFull } from "../../Config/ChatLogic";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
const SingleChat = () => {
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
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
          ></Box>
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
