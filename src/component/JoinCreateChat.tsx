import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";

const JoinCreateChat = ({ onSessionReady }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [stompClient, setStompClient] = useState(null);

  // Tự động dọn dẹp và đóng kết nối nếu component bị tắt đột ngột
  useEffect(() => {
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [stompClient]);

  // Hàm xử lý kết nối WebSocket và gửi tín hiệu lên Spring Boot
  const handleConnect = (actionType, selectedRoomId) => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-chat", 
      debug: (str) => console.log(str),
      onConnect: (frame) => {
        console.log("Connected via Native WebSocket: " + frame);
        setStompClient(client);

        // 1. Đăng ký nhận phản hồi trạng thái từ hệ thống phòng
        client.subscribe(`/topic/room/${selectedRoomId}`, (message) => {
          const payload = JSON.parse(message.body);
          console.log("Phản hồi từ Server:", payload);
          
          // KIỂM TRA TRẠNG THÁI TỪ SERVER TRẢ VỀ
          if (payload.sender === "Hệ thống") {
            // Nếu có lỗi (Ví dụ: Phòng không tồn tại khi Join)
            if (payload.content.startsWith("LỖI:")) {
              alert(payload.content); // Hiển thị thông báo lỗi
              client.deactivate();    // Ngắt kết nối tạm thời để cấu hình lại
              return;
            }

            // Nếu thành công (Tạo thành công hoặc Phòng hợp lệ để vào)
            if (onSessionReady) {
              onSessionReady({ client, name, roomId: selectedRoomId });
            }
          }
        });

        // 2. Bắn yêu cầu (Publish) gửi kèm key 'sender' thay vì 'name' để khớp Entity Java
        client.publish({
          destination: `/app/${actionType}`,
          body: JSON.stringify({
            sender: name.trim(), 
            roomId: selectedRoomId,
            content: "" 
          }),
        });
      },
      onStompError: (frame) => {
        alert("Lỗi kết nối STOMP: " + frame.headers["message"]);
      },
    });

    client.activate(); 
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomId.trim()) {
      alert("Vui lòng nhập đầy đủ Tên và Mã phòng!");
      return;
    }
    handleConnect("join-room", roomId.trim());
  };

  const handleCreateRoom = () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên của bạn trước khi tạo phòng!");
      return;
    }
    const finalRoomId = roomId.trim() || Math.random().toString(36).substring(2, 8).toUpperCase();
    if (!roomId) setRoomId(finalRoomId);

    handleConnect("create-room", finalRoomId);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[450px] bg-[#161b22] border border-[#30363d] rounded-2xl p-10 shadow-2xl">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 bg-[#ffcc33] rounded-full flex items-center justify-center shadow-lg">
            <div className="absolute top-5 right-5 w-10 h-7 bg-[#f43f5e] rounded-xl flex items-center justify-center gap-0.5 shadow-md">
               <div className="w-1 h-1 bg-white rounded-full"></div>
               <div className="w-1 h-1 bg-white rounded-full"></div>
               <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="absolute bottom-5 left-5 w-10 h-7 bg-white rounded-xl flex items-center justify-center gap-0.5 shadow-lg">
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <h1 className="text-white text-2xl font-bold text-center mb-8 tracking-tight">
          Join Room / Create Room ..
        </h1>

        <div className="space-y-6">
          <div className="text-left">
            <label className="text-gray-300 text-sm font-medium mb-2 block ml-1">Your name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#30363d] text-white rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:border-blue-400"
              placeholder="Nhập tên của bạn..."
            />
          </div>

          <div className="text-left">
            <label className="text-gray-300 text-sm font-medium mb-2 block ml-1">Room ID / New Room ID</label>
            <input 
              type="text" 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-[#30363d] text-white rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:border-blue-400"
              placeholder="Nhập mã phòng..."
            />
          </div>
        </div>

        <div className="flex flex-row gap-4 mt-10 justify-center">
          <button 
            onClick={handleJoinRoom}
            className="bg-[#2563eb] hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all active:scale-95 cursor-pointer shadow-md"
          >
            Join Room
          </button>
          <button 
            onClick={handleCreateRoom}
            className="bg-[#ea580c] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all active:scale-95 cursor-pointer shadow-md"
          >
            Create Room
          </button>
        </div>

      </div>
    </div>
  );
};

export default JoinCreateChat;