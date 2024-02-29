import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import { useSelector } from "react-redux";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";

const SideDrawer = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate()

  const handleLogOut = () =>{
    localStorage.removeItem("userInfo")
    navigate("/")
  }
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
          <Button variant="ghost">
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
              <ProfileModel user={user} >
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </div>
  );
};

export default SideDrawer;
