import prisma from '../prisma.js';

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: req.user.id,
                },
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};