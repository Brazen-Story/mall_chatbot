import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
    throw new Error("SERVER_TOKEN_SECRET is not defined in environment variables.");
}

const extractJWT = (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        // 토큰이 있으면 그 유효성을 확인
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    message: error,
                    error
                });
            } else {
                // 토큰이 유효하면 디코딩된 토큰을 응답 객체에 첨부하고 다음 미들웨어로 진행
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default extractJWT;