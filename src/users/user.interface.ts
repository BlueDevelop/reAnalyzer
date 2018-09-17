import { Document } from 'mongoose';

export default interface IUser extends Document {
    uniqueId: string;
    password?: string;
    name: string;
    generateHash(password: string) : string;
    validPassword(password: string) : boolean;
}