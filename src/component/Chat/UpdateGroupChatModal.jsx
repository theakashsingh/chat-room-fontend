import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { useEffect, useState } from "react";
import {
  addUserToGroup,
  removeUserFromGroup,
  renameGroupChat,
} from "../../redux/features/chatSlice";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = () => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const renameGroup = useSelector(state => state.chat.renameGroup);
  const addToGroup = useSelector(state => state.chat.addToGroup);
  const removeFromGroup = useSelector(state => state.chat.removeFromGroup);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const toast = useToast();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const handleRemove = userToRemove => {
    if (selectedChat.value.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast({
        title: "Only admin can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    dispatch(removeUserFromGroup({selectedChat,userToRemove,config}))
    userToRemove._id === user._id
  };
  const handleAddUser = userToAdd => {
    if (selectedChat.value.users.find(u => u._id === userToAdd._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.value.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    dispatch(addUserToGroup({ selectedChat,userToAdd,config}));
  };
  const handleRename = () => {
    if (!groupChatName) {
      return;
    }

    dispatch(renameGroupChat({ groupChatName, selectedChat, config }));
  };

  useEffect(() => {
    if (renameGroup.error) {
      toast({
        title: "Error Occurred",
        description: renameGroup.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setGroupChatName("");
      return;
    }
  }, [renameGroup]);

  useEffect(()=>{
    if (addToGroup.error) {
      toast({
        title:"Error Occurred",
        description:addToGroup.error,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
    }
  },[addToGroup.error])

  useEffect(()=>{
    if (removeFromGroup.error) {
      toast({
        title:"Error Occurred",
        description:removeFromGroup.error,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
    }
  },[removeFromGroup.error])

  const handleSearch = async query => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <IconButton display={"flex"} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {" "}
            {selectedChat.value.chatName}{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {" "}
              {selectedChat.value.users.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}{" "}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameGroup.loading}
                onClick={handleRename}
              >
                update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Ashish, Pawan, Akash"
                mb={1}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map(currUser => (
                <UserListItem
                  key={currUser._id}
                  user={currUser}
                  handleFunction={() => handleAddUser(currUser)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
