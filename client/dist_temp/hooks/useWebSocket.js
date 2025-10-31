import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
export const useWebSocket = (url = '/ws') => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const ws = useRef(null);
    const { token } = useAuth();
    const connect = useCallback(() => {
        if (!token)
            return;
        const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3000'}${url}`;
        ws.current = new WebSocket(wsUrl);
        ws.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        };
        ws.current.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected');
        };
        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setLastMessage(message);
            }
            catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }, [token, url]);
    const disconnect = useCallback(() => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
    }, []);
    const sendMessage = useCallback((message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
    }, []);
    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);
    // Reconnect on token change
    useEffect(() => {
        if (token) {
            disconnect();
            connect();
        }
    }, [token, disconnect, connect]);
    return {
        isConnected,
        lastMessage,
        sendMessage,
        connect,
        disconnect
    };
};
