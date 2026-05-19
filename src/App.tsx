import React, { useState } from "react";
import JoinCreateChat from "./component/JoinCreateChat";
import ChatRoom from "./component/ChatRoom";

function App() {
  const [chatSession, setChatSession] = useState(null);

  // Hàm này được kích hoạt khi kết nối WebSocket thành công và phòng hợp lệ
  const handleSessionReady = (sessionData) => {
    // sessionData bao gồm: { client, name, roomId }
    setChatSession(sessionData);
  };

  return (
    <div className="App">
      {!chatSession ? (
        // Nếu chưa có session, hiển thị màn hình chọn phòng
        <JoinCreateChat onSessionReady={handleSessionReady} />
      ) : (
        // Nếu đã có session kết nối thành công, đẩy vào màn hình chat chính
        <ChatRoom session={chatSession} />
      )}
    </div>
  );
}

export default App;