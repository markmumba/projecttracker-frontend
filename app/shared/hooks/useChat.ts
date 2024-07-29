import { useState, useEffect, useRef } from "react";
import { MessageDetails } from "../types";
import { useUserStore } from "../store";



export const useChat = () => {
  const [messages, setMessages] = useState<MessageDetails[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUserStore();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket(`ws://process.env.NEXT_BACKEND_API_URL /ws`);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (message.trim() && isConnected && ws.current) {
      const chatMessage = {
        message: message.trim(),
      };
      ws.current.send(JSON.stringify(chatMessage));
    }
  };

  return { messages, isConnected, sendMessage };
};