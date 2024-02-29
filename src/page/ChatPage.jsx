import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import SideDrawer from "../component/Chat/SideDrawer";
import MyChats from "../component/Chat/MyChats";
import ChatBox from "../component/Chat/ChatBox";

const ChatPage = () => {
  const auth = useSelector(state => state.auth);
  return (
    <div style={{ width: "100%" }}>
      {auth.user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="92.5vh"
        padding="10px"
      >
        {auth.user && <MyChats />}
        {auth.user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
