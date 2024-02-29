import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import HomePage from "./page/HomePage";
import ChatPage from "./page/ChatPage";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginFromLocalStorage } from "./redux/features/authSlice";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      navigate("/");
    }
    if (user) {
      dispatch(loginFromLocalStorage(user));
    }
  }, [navigate]);

  return (
    <ChakraProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
