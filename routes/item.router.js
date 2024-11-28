import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// 아이템 생성
// 이름 중복이 때 처리 방법? 일단은 예외처리
router.post('/item', async (req, res, next) => {
    const { itemName, atk, def, power, price } = req.body;
    try {
        const item = await prisma.items.create({
            data: {
                itemName,
                atk,
                def,
                power,
                price,
            },
        });
        return res.status(201).json({ data: item });
    } catch (errorMessage) {
        return res.status(404).json({ errorMessage: errorMessage });
    }
});

// 아이템 목록 조회
router.get('/item', async (req, res, next) => {
    const items = await prisma.items.findMany({
        select: {
            itemId: true,
            itemName: true,
            price: true,
        }
    })
    return res.status(200).json({ data: items });
});

// 아이템 상세 조회
router.get('/item/:itemId', async (req, res, next) => {
    const { itemId } = req.params;

    const item = await prisma.items.findMany({
        where: { itemId: +itemId },
        select: {
            itemName: true,
            atk: true,
            def: true,
            power: true,
            price: true,
        }
    })
    return res.status(200).json({ data: item });
})

// 아이템 수정
router.put('/item/:itemId', async (req, res, next) => {
    const { itemId } = req.params;
    const { itemName, atk, def, power } = req.body;

    const item = await prisma.items.findUnique({
        where: { itemId: +itemId },
    });

    if (!item)
        return res.status(404).json({ message: '아이템이 존재하지 않습니다.' });

    await prisma.items.update({
        data: { itemName, atk, def, power },
        where: {
            itemId: +itemId,
        },
    });

    return res.status(200).json({ data: '아이템이 수정되었습니다.' });
});

// 아이템 삭제
router.delete('/item/:itemId', async (req, res, next) => {
    const { itemId } = req.params;

    const item = await prisma.items.findFirst({ where: { itemId: +itemId } });

    if (!item)
        return res.status(404).json({ message: '아이템이 존재하지 않습니다.' });

    await prisma.items.delete({ where: { itemId: +itemId } });

    return res.status(200).json({ data: '아이템이 삭제되었습니다.' });
});

export default router;