import { useEffect } from "react"
import {useDispatch, useSelector} from "react-redux"
import { getChat } from "../redux/features/chatSlice";

const ChatPage = () => {
    const dispatch = useDispatch();
    const chat = useSelector(state => state.chat)
    useEffect(() => {
      dispatch(getChat())
    }, [])
    console.log(chat);
    
  return (
    <div>Chat Page</div>
  )
}

export default ChatPage