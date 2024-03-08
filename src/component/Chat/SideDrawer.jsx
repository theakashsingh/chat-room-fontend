import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import {
  getSelectedChat,
  removeNotificationAfterSeen,
  selectToChat,
} from "../../redux/features/chatSlice";
import { getSender } from "../../Config/ChatLogic";
import { axiosInstance } from "../../Config/axiosInstance";


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.auth.user);
  const { selectedChat, notification } = useSelector(state => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleLogOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosInstance.get(`/api/user?search=${search}`, config);
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

  const handleAccessChat = async userId => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const credentials = { userId, config };
    dispatch(getSelectedChat(credentials));
  };
  useEffect(() => {
    if (selectedChat.error) {
      toast({
        title: "Error fetching chat",
        description: selectedChat.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    onClose();
  }, [selectedChat.error]);

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <Search2Icon />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work sans">
          Chat Room
        </Text>
        <div>
          <Menu>
            <MenuButton p="1">
              <BellIcon fontSize="2x1" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length
                ? "No New Message"
                : notification.map(currNotifi => (
                    <MenuItem
                      key={currNotifi._id}
                      onClick={() => {
                        dispatch(selectToChat(currNotifi.chat));
                        dispatch(removeNotificationAfterSeen(currNotifi));
                      }}
                    >
                      {currNotifi.chat.isGroupChat
                        ? `New message in ${currNotifi.chat.chatName}`
                        : `New message from ${getSender(
                            user,
                            currNotifi.chat.users
                          )}`}
                    </MenuItem>
                  ))}{" "}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name of email"
                mr={2}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAccessChat(user._id)}
                />
              ))
            )}
            {selectedChat.loading && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
