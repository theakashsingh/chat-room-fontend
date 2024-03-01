import { CloseIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Button
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant={"solid"}
      fontSize={12}
      cursor={"pointer"}
      onClick={handleFunction}
    >
      {user.name} <CloseIcon pl={1}/>
    </Button>
  );
};

export default UserBadgeItem;
