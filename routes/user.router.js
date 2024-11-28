import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';
import joi from 'joi';

const router = express.Router();

// 회원가입 / 유저 생성
// 이름 중복이 때 처리 방법? 일단은 예외처리
router.post('/sign-up', async (req, res, next) => {
    const { account, password, pwconfig } = req.body;

    // 회원 정보 중복 검사
    const isExistAccount = await prisma.users.findFirst({
        where: { account }
    });

    if (isExistAccount) {
        return res.status(409).json({ message: "이미 존재하는 계정입니다" });
    }

    const accSchema = joi.string()
        .pattern(/^[a-z0-9]+$/)
        .required();
    const accValidation = accSchema.validate(account);
    if (accValidation.error) {
        console.log(accValidation.error.message);
        return res.status(409).json({ message: "계정은 영어 소문자와 숫자로만 이루어져야합니다" });
    }

    const pwSchema = joi.string()
        .min(6)
        .required();
    const pwValidation = pwSchema.validate(password);
    if (pwValidation.error) {
        console.log(pwValidation.error.message);
        return res.status(409).json({ message: "비밀번호는 최소 6자리여야합니다" });
    }
    if (password !== pwconfig) {
        return res.status(409).json({ message: "비밀번호 확인과 다릅니다" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원 정보 등록
    const user = await prisma.users.create({
        data: {
            account,
            password: hashedPassword,
        },
    });

    return res.status(201).json({ data: user });
});

// 로그인
router.post('/sign-in', async (req, res, next) => {
    const { account, password } = req.body;

    const user = await prisma.users.findFirst({ where: { account } });

    if (!user)
        return res.status(401).json({ message: '존재하지 않는 계정입니다.' });
    if (!(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: '비밀번호가 다릅니다.' });

    const token = jwt.sign(
        { userId: user.userId },
        'my_secret_key'
    );

    res.cookie('authorization', `Bearer ${token}`);
    return res.status(200).json({ message: '로그인에 성공했습니다.' });
})

// 유저 정보 조회
router.get('/user', authMiddleware, async (req, res, next) => {
    const { userId } = req.user;

    const user = await prisma.users.findFirst({
        where: { userId: +userId },
        select: {
            userId: true,
            account: true,
            Characters: {
                select: {
                    charName: true,
                    createdAt: true,
                    updatedAt: true,
                }
            }
        }
    });

    return res.status(200).json({ data: user });
});

export default router;