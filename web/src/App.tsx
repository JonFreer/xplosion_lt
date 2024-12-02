import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { socket } from './socket'

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [state, setState] = useState({});

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("connected")
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onState(msg:any) {
      console.log("onState",msg)
      setState(msg);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('state', onState);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('state', onState);
    };
  }, []);



  return (
    <>
    </>
  )
}

export default App
