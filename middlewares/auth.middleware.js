import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

export default async function (req, res, next) {
    try {
        const { authorization } = req.cookies;
        if (!authorization) throw new Error('토큰이 존재하지 않습니다');

        // authorization "Bearer asdfasdf"
        const [tokenType, token] = authorization.split(' ');
        if (tokenType !== 'Bearer') throw new Error('토큰 타입이 다릅니다');

        const decodedToken = jwt.verify(token, 'my_secret_key');
        const userId = decodedToken.userId;

        const user = await prisma.users.findFirst({
            where: { userId: +userId },
        });
        if (!user) throw new Error('토큰 사용자가 존재하지 않습니다');

        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}