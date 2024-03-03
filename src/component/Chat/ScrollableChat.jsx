import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../Config/ChatLogic";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = () => {
  const messages = useSelector(state => state.message.messages);
  const user = useSelector(state => state.auth.user);
  return (
    <ScrollableFeed>
      {messages.value &&
        messages.value.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages.value, m, i, user._id) ||
              isLastMessage(messages.value, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt={"7px"}
                  mr={"1"}
                  size={"sm"}
                  cursor={"pointer"}
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages.value, m, i, user._id),
                marginTop: isSameUser(messages.value, m, i)?3:10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
