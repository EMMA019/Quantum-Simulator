import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        setError(null);
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e, event.data);
          setError('Failed to parse message: ' + event.data);
        }
      };

      ws.current.onerror = (e) => {
        console.error('WebSocket Error:', e.message);
        setError(e.message);
        setIsConnected(false);
      };

      ws.current.onclose = (e) => {
        console.log('WebSocket Disconnected:', e.code, e.reason);
        setIsConnected(false);
        // Attempt to reconnect after a delay
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open. Message not sent:', message);
      setError('WebSocket is not open.');
    }
  }, []);

  const sendJsonMessage = useCallback((jsonMessage) => {
    sendMessage(jsonMessage);
  }, [sendMessage]);

  return { isConnected, lastMessage, error, sendJsonMessage };
};

export default useWebSocket;