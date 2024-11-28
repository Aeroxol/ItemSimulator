import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';
import joi from 'joi';

const router = express.Router();

// 캐릭터 생성
// 이름 중복이 때 처리 방법? 일단은 예외처리
router.post('/character', authMiddleware, async (req, res, next) => {
    const { charName } = req.body;
    const userId = req.user.userId;

    // 회원 정보 중복 검사
    const isExistChar = await prisma.characters.findFirst({
        where: { charName }
    });

    if (isExistChar) {
        return res.status(409).json({ message: "이미 존재하는 캐릭터 이름입니다" });
    }

    // 캐릭터 정보 등록
    const char = await prisma.characters.create({
        data: {
            charName,
            userId,
        },
    });

    return res.status(201).json({ data: char });
});

// 캐릭터 삭제
router.delete('/character/:charId', authMiddleware, async (req, res, next) => {
    const { charId } = req.params;
    const userId = req.user.userId;

    const char = await prisma.characters.findFirst(
        {
            where:
            {
                charId: +charId,
                userId: +userId
            }
        });

    if (!char)
        return res.status(404).json({ message: '캐릭터가 존재하지 않습니다.' });

    await prisma.characters.delete({ where: { charId: +charId } });

    return res.status(200).json({ data: '캐릭터가 삭제되었습니다.' });
})

// 캐릭터 조회
router.get('/character/:charId', authMiddleware, async (req, res, next) => {
    const { charId } = req.params;
    const userId = req.user.userId;

    const char = await prisma.characters.findFirst({
        where: { charId: +charId },
    });
    
    if (!char)
        return res.status(404).json({ message: '캐릭터가 존재하지 않습니다.' });

    if (char.userId === +userId) {
        const charr = await prisma.characters.findFirst({
            where: { charId: +charId },
            select: {
                charName: true,
                health: true,
                power: true,
                money: true
            }
        });
        return res.status(200).json({ data: charr });
    } else {
        const charr = await prisma.characters.findFirst({
            where: { charId: +charId },
            select: {
                charName: true,
                health: true,
                power: true,
            }
        });
        return res.status(200).json({ data: charr });
    }
})

export default router;