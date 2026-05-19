import React, { useState, useEffect, useRef } from "react";

const ChatRoom = ({ session }) => {
  // Nhận thông tin client, name (sender), và roomId từ session của màn hình trước
  const { client, name: sender, roomId } = session;

  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef(null);

  // 1. Đăng ký lắng nghe tin nhắn từ phòng chat khi vào màn hình này
  useEffect(() => {
    if (!client || !client.connected) return;

    // Lắng nghe kênh /topic/room/{roomId}
    const subscription = client.subscribe(`/topic/room/${roomId}`, (message) => {
      const payload = JSON.parse(message.body);
      console.log("Nhận tin nhắn mới:", payload);
      
      // Thêm tin nhắn mới nhận được vào danh sách hiển thị
      setMessages((prevMessages) => [...prevMessages, payload]);
    });

    // Hủy đăng ký (Unsubscribe) khi người dùng rời màn hình (component unmount)
    return () => {
      subscription.unsubscribe();
    };
  }, [client, roomId]);

  // 2. Tự động cuộn xuống đáy khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Hàm gửi tin nhắn lên Spring Boot
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !client || !client.connected) return;

    // Khớp cấu trúc dữ liệu với MessageRequest / Message Entity ở Backend
    const messagePayload = {
      sender: sender,
      content: typedMessage.trim(),
      roomId: roomId,
      messageTime: new Date().toISOString() // Định dạng ISO thời gian gửi
    };

    client.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify(messagePayload),
    });

    setTypedMessage(""); // Xóa rỗng ô nhập liệu sau khi gửi
  };

  // Hàm hỗ trợ format giờ hiển thị (HH:MM)
  const formatTime = (timeStampString) => {
    if (!timeStampString) return "";
    try {
      const date = new Date(timeStampString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-[800px] h-[85vh] bg-[#161b22] border border-[#30363d] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header Phòng Chat */}
        <div className="bg-[#21262d] px-6 py-4 border-b border-[#30363d] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h2 className="font-bold text-lg">Phòng Chat</h2>
              <p className="text-xs text-gray-400">Đang đăng nhập: <span className="text-blue-400 font-semibold">{sender}</span></p>
            </div>
          </div>
          <div className="bg-[#30363d] px-4 py-2 rounded-full border border-[#484f58] flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">Mã phòng:</span>
            <span className="text-sm font-bold text-orange-400 font-mono tracking-wider">{roomId}</span>
          </div>
        </div>

        {/* Khung chứa nội dung tin nhắn */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0d1117]">
          {messages.map((msg, index) => {
            const isMe = msg.sender === sender;
            const isSystem = msg.sender === "Hệ thống";

            if (isSystem) {
              return (
                <div key={index} className="flex justify-center my-2">
                  <span className="bg-[#21262d] border border-[#30363d] text-gray-400 text-xs px-4 py-1.5 rounded-full shadow-sm italic">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!isMe && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm text-white uppercase shadow-sm">
                    {msg.sender.charAt(0)}
                  </div>
                )}
                <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && <span className="text-xs text-gray-400 mb-1 ml-1">{msg.sender}</span>}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-md break-all ${
                    isMe 
                      ? "bg-[#2563eb] text-white rounded-br-none" 
                      : "bg-[#21262d] border border-[#30363d] text-gray-200 rounded-bl-none"
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {formatTime(msg.timeStamp)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Ô Nhập và Gửi Tin Nhắn */}
        <form onSubmit={handleSendMessage} className="bg-[#161b22] p-4 border-t border-[#30363d] flex gap-3 items-center">
          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder="Nhập nội dung tin nhắn..."
            className="flex-1 bg-[#30363d] border border-transparent focus:border-blue-500 text-white rounded-full px-6 py-3 outline-none transition-all text-sm focus:ring-2 focus:ring-blue-900"
          />
          <button
            type="submit"
            disabled={!typedMessage.trim()}
            className="bg-[#2563eb] hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold h-11 px-6 rounded-full transition-all active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
          >
            Gửi
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatRoom;