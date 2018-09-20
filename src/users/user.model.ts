import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import IUser from './user.interface';

const userSchema = new Schema({
    uniqueId: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

userSchema.methods.generateHash = function generateHash(password: string) : string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.validPassword = function validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
}

userSchema.pre<IUser>('save', function preSave(this: IUser, next: Function) {
    if (this.password) {
        this.password = this.generateHash(this.password);
    }
    
    next();
});

export default model<IUser>('users', userSchema);