import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./page/HomePage";
import ChatPage from "./page/ChatPage";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
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
