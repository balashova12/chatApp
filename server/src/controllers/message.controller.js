import prisma from '../lib/prisma.js';

export const getMessages = async (req, res) => {
    try {
        const chatId = parseInt(req.params.chatId);
        const currentUserId = req.user.id;

        const participant = await prisma.chatParticipant.findUnique({
            where: {
                userId_chatId: { userId: currentUserId, chatId },
            },
        });

        if (!participant) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messages = await prisma.message.findMany({
            where: { chatId },
            include: {
                sender: {
                    select: { id: true, username: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return res.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const chatId = parseInt(req.params.chatId);
        const currentUserId = req.user.id;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const participant = await prisma.chatParticipant.findUnique({
            where: {
                userId_chatId: { userId: currentUserId, chatId },
            },
        });

        if (!participant) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                senderId: currentUserId,
                chatId,
            },
            include: {
                sender: {
                    select: { id: true, username: true },
                },
            },
        });

        return res.status(201).json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};