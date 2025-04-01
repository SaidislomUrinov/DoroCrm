import { Server } from "socket.io";

/**
 * Initializes socket.io namespaces and manages socket connections.
 * @param {http.Server} server - The HTTP server instance.
 */
export function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    // List of namespaces to create
    const namespaces = ['users', 'staffs', 'admins'];

    namespaces.forEach(namespace => {
        const nsp = io.of(`/${namespace}`);

        nsp.on('connection', (socket) => {
            const userId = socket.handshake.auth.authorization;

            if (!userId) {
                socket.disconnect(true);
                return;
            }

            const room = namespace;

            if (nsp.adapter.rooms.has(room)) {
                const existingSockets = nsp.adapter.rooms.get(room);
                for (const existingSocketId of existingSockets) {
                    const existingSocket = nsp.sockets.get(existingSocketId);
                    if (existingSocket.userId === userId) {
                        existingSocket.disconnect(true);
                        break;
                    }
                }
            }

            socket.userId = userId;
            socket.join(room);

            socket.on('disconnect', () => {
                socket.leave(room);
            });
        });
    });
}
