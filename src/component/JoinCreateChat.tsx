import React from "react";

const JoinCreateChat = () => {
  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[450px] bg-[#161b22] border border-[#30363d] rounded-2xl p-10 shadow-2xl">
        
        {/* Logo Section - Vẽ lại icon bằng Tailwind */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 bg-[#ffcc33] rounded-full flex items-center justify-center shadow-lg">
            {/* Bong bóng chat màu hồng */}
            <div className="absolute top-5 right-5 w-10 h-7 bg-[#f43f5e] rounded-xl flex items-center justify-center gap-0.5 shadow-md">
               <div className="w-1 h-1 bg-white rounded-full"></div>
               <div className="w-1 h-1 bg-white rounded-full"></div>
               <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            {/* Bong bóng chat màu trắng */}
            <div className="absolute bottom-5 left-5 w-10 h-7 bg-white rounded-xl flex items-center justify-center gap-0.5 shadow-lg">
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-white text-2xl font-bold text-center mb-8 tracking-tight">
          Join Room / Create Room ..
        </h1>

        {/* Form Inputs */}
        <div className="space-y-6">
          {/* Input Tên người dùng */}
          <div className="text-left">
            <label className="text-gray-300 text-sm font-medium mb-2 block ml-1">Your name</label>
            <input 
              type="text" 
              className="w-full bg-[#30363d] text-white rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:border-blue-400"
              placeholder="Nhập tên của bạn..."
            />
          </div>

          {/* Input Mã phòng */}
          <div className="text-left">
            <label className="text-gray-300 text-sm font-medium mb-2 block ml-1">Room ID / New Room ID</label>
            <input 
              type="text" 
              className="w-full bg-[#30363d] text-white rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent focus:border-blue-400"
              placeholder="Nhập mã phòng..."
            />
          </div>
        </div>

        {/* Buttons - Nhóm nút bấm */}
        <div className="flex flex-row gap-4 mt-10 justify-center">
          <button className="bg-[#2563eb] hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all active:scale-95 cursor-pointer shadow-md">
            Join Room
          </button>
          <button className="bg-[#ea580c] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all active:scale-95 cursor-pointer shadow-md">
            Create Room
          </button>
        </div>

      </div>
    </div>
  );
};

export default JoinCreateChat;