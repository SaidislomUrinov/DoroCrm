import { io } from "socket.io-client";

let sckt = null;

export const connectSocket = (uId, setIsConnect) => {
    if (!uId) {
        setIsConnect(false);
        return null;
    }

    sckt = io("http://localhost:5000/admins", {
        auth: {
            authorization: uId,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
    });

    sckt.on("connect", () => {
        setIsConnect(prev => {
            if (!prev) return true; // State faqat o'zgarganda yangilanadi
            return prev;
        });
    });

    sckt.on("disconnect", () => {
        setIsConnect(prev => {
            if (prev) return false;
            return prev;
        });
    });

    return sckt;
};

export const socket = () => sckt;
