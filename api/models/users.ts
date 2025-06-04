import { Schema, model } from 'mongoose';

export enum UserRoles {
    Owner = 'owner',
    Admin = 'admin',
    Employee = 'employee',
}

export interface IUser extends Document {
    email: string,
    name: string,
    role: UserRoles,
    photoUrl: string,
    password: string
}

const userSchema = new Schema({
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email is invalid'],
    }, 
    name: {type: String, required: true},
    role : {
        type: String,
        enum: Object.values(UserRoles),
        required: true,
        default: UserRoles.Employee,
    },
    photoUrl: {type: String, required: true},
    password: {type: String, required: true},
});

const User = model<IUser>('User', userSchema);

export default User;