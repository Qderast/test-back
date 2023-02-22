import { Request } from 'express';

export interface UserDataForRequest extends Request {
    userId: string;
}
