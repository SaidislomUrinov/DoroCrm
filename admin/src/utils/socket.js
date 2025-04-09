import { io } from 'socket.io-client';
import { API } from './fetching';
let socket = null;

export const connectSocket = (uId, setConnect) => {
    if (socket) return socket;

    socket = io(API + '/admins', {
        transports: ['websocket'],
        auth: { authorization: uId },
        reconnectionAttempts: 5,
        reconnectionDelay: 3000
    });

    socket.on('connect', () => {
        setConnect(true);
    });

    socket.on('disconnect', () => {
        setConnect(false);
    });

    // socket.on('connect_error', (err) => {
    //     console.error('❗️Ulanishda xatolik:', err.message);
    // });

    return socket;
};
