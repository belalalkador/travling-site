import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './Context/Context.jsx'; 
import { SocketProvider } from './Context/Socket.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <SocketProvider>
    <App />
    </SocketProvider>
    </UserProvider>

   
  </StrictMode>,
)
