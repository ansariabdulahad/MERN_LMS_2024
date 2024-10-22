import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// compare the password against the hash password
UserSchema.methods.compareHashPassword = async function (comparePassword) {
    try {
        return await bcrypt.compare(comparePassword, this.password);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};

// generate the jwt token while logging in
UserSchema.methods.generateAccessToken = async function () {
    try {
        const token = jwt.sign({
            _id: this._id,
            userName: this.userName,
            userEmail: this.userEmail,
            role: this.role
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return token;
    } catch (error) {
        console.error('Error generating access token:', error);
        return null;
    }
}

export default model('User', UserSchema);