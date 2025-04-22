import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from './lib/prisma.js';

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User ${socket.userId} connected`);

        socket.on('join_chat', (chatId) => {
            socket.join(`chat_${chatId}`);
        });

        socket.on('leave_chat', (chatId) => {
            socket.leave(`chat_${chatId}`);
        });

        socket.on('send_message', async ({ chatId, content }) => {
            try {
                if (!content || !content.trim()) return;

                const participant = await prisma.chatParticipant.findUnique({
                    where: {
                        userId_chatId: { userId: socket.userId, chatId },
                    },
                });

                if (!participant) {
                    socket.emit('error', { message: 'Access denied' });
                    return;
                }

                const message = await prisma.message.create({
                    data: {
                        content: content.trim(),
                        senderId: socket.userId,
                        chatId,
                    },
                    include: {
                        sender: {
                            select: { id: true, username: true },
                        },
                    },
                });

                io.to(`chat_${chatId}`).emit('new_message', message);
            } catch (error) {
                console.error('Socket send_message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
        });
    });

    return io;
};