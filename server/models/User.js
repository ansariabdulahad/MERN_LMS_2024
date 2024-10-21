import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // to exclude the password use - select : false
    role: { type: String }
}, { timestamps: true });

// hash the password and store
UserSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

export default model('User', UserSchema);