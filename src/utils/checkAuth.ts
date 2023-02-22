import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response } from 'express';
import { UserDataForRequest } from '../types/auth';

export default (req: UserDataForRequest, res: Response, next: () => void) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret_victora');

            req.userId = (decoded as JwtPayload).id;
            next();
        } catch (error) {
            console.log(error, 'error');

            res.status(403).json({
                message: 'Access error',
            });
        }
    } else {
        return res.status(404);
    }
};
