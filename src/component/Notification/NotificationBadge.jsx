import "./NotificationBadge.css";
import { BellIcon } from "@chakra-ui/icons";

const NotificationBadge = ({ count }) => {

  return (
    <>

     {count ? <div className="notification_badge" data={count}>
      <BellIcon h={7} w={7} m={1} />
    </div>:<div>
      <BellIcon h={7} w={7} m={1} />
    </div>}
    </>
  );
};

export default NotificationBadge;
