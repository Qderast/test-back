import { Schema, model } from 'mongoose';

interface DocumentResult<T> {
    _doc: T;
}

export interface UserI extends DocumentResult<UserI> {
    fullName: string;
    email: string;
    passwordHash: string;
    avatarUrl: string;
    testField?: string;
}

const UserSchema = new Schema<UserI>(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: String,
        testField: String,
    },
    {
        timestamps: true,
    },
);

export default model('User', UserSchema);
