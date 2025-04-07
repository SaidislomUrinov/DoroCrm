import { io } from 'socket.io-client'
import { API } from './fetching';
let socket = null;
const url = `${API}/admin`;

export const connectSocket = (uId) => {
    if (socket && socket.connected) return socket;
    socket = io(url, {
        auth: {
            authorization: uId
        },
        transports: ['websocket']
    });
    return socket
};

export { socket };