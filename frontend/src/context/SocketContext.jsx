
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
});

const SocketProvider = ({ children }) => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });

        socket.on('connect_error', (err) => {
            // Silently handle socket errors on serverless environments like Vercel
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;