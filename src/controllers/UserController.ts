import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import UserModel, { UserI } from '../models/User';
import { HydratedDocument } from "mongoose";
import jwt from 'jsonwebtoken';
import { UserDataForRequest } from "../types/auth";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });

        const user: HydratedDocument<UserI> = await doc.save();

        const token = jwt.sign(
            {
                id: user._id,
            },
            'secret_victora',
            { expiresIn: '30d' },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        console.log(err, 'Register error');

        res.status(500).json({
            message: 'произошла ошибка',
        });
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Auth error',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(403).json({
                message: 'Wrong login or password',
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            'secret_victora',
            { expiresIn: '30d' },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка авторизации',
        });
    }
}

export const userMe =  async (req: UserDataForRequest, res) => {
    try {
        console.log(req.userId);
        
        const user = await UserModel.findById(req.userId);

        if (!user) {
            res.status(404).json({
                message: 'no user found',
            });
        }
        const { passwordHash, ...userData } = user._doc;
        res.status(200).json({
            ...userData,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error',
        });
    }
}