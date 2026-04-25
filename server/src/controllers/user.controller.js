import prisma from '../lib/prisma.js';

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { id: { not: req.user.id } },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error.message, error.stack);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user.id;

        if (username) {
            const existing = await prisma.user.findFirst({
                where: { username, id: { not: userId } },
            });
            if (existing) {
                return res.status(400).json({ message: 'Имя пользователя уже занято' });
            }
        }

        const data = {};
        if (username) data.username = username;
        if (req.file) data.avatar = req.file.path;

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, username: true, email: true, avatar: true },
        });

        return res.json({ user });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};