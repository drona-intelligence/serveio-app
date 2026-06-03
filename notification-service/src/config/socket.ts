import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export function initSocket(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("register", (payload: { userId: string; role?: string } | string) => {
            let userId: string;
            let role: string | undefined;

            if (typeof payload === "string") {
                userId = payload;
            } else {
                userId = payload.userId;
                role = payload.role;
            }

            socket.join(`user:${userId}`);
            console.log(`Socket ${socket.id} joined room user:${userId}`);

            if (role === "ADMIN" || role === "OWNER") {
                socket.join("admin");
                console.log(`Socket ${socket.id} joined room admin`);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });

    return io;
}