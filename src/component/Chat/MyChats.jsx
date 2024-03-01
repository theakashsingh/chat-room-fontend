import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getChat } from "../../redux/features/chatSlice";
import { useEffect } from "react";

const MyChats = () => {
  const user = useSelector(state => state.auth.user);
  const chats = useSelector(state => state.chat.chats);
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

  useEffect(()=>{
    handleGetChat()
  },[])
  console.log(chats.value);
  return <div></div>;
};

export default MyChats;
