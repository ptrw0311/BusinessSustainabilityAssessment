import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // ✅ 保持引入，Tailwind 會在建置時展開

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)