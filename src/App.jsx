import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./page/HomePage";
import ChatPage from "./page/ChatPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} exact/>
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default App;
