import prisma from '../lib/prisma.js';

export const createOrGetChat = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        if (userId === currentUserId) {
            return res.status(400).json({ message: 'Cannot create chat with yourself' });
        }

        const existingChat = await prisma.chat.findFirst({
            where: {
                participants: {
                    every: {
                        userId: { in: [currentUserId, userId] },
                    },
                },
                AND: {
                    participants: {
                        some: { userId: currentUserId },
                    },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, username: true, email: true },
                        },
                    },
                },
            },
        });

        if (existingChat && existingChat.participants.length === 2) {
            const hasOtherUser = existingChat.participants.some(p => p.userId === userId);
            if (hasOtherUser) {
                return res.status(200).json({ chat: existingChat });
            }
        }

        const chat = await prisma.chat.create({
            data: {
                participants: {
                    create: [
                        { userId: currentUserId },
                        { userId: userId },
                    ],
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, username: true, email: true },
                        },
                    },
                },
            },
        });

        return res.status(201).json({ chat });
    } catch (error) {
        console.error('Error creating chat:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getChats = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { userId: currentUserId },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, username: true, email: true },
                        },
                    },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // последнее сообщение для превью
                    include: {
                        sender: {
                            select: { id: true, username: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return res.json({ chats });
    } catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};