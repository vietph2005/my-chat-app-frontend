import { useState } from 'react'
import JoinCreateChart from './component/JoinCreateChat' // Giả sử bạn lưu file kia vào thư mục src/components
import './App.css'

function App() {
  return (
    <div className="App">
      {/* Gọi component giao diện Join Room ở đây */}
      <JoinCreateChart />
    </div>
  )
}

export default App