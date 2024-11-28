import express from 'express';
import cookieParser from 'cookie-parser';
import itemRouter from './routes/item.router.js';
import userRouter from './routes/user.router.js';
import charRouter from './routes/char.router.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', itemRouter);
app.use('/api', userRouter);
app.use('/api', charRouter);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버를 열었습니다');
})