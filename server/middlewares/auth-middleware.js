import jwt from 'jsonwebtoken';

// verify token validity
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        console.error("Error verifying token :: ", error);
        return null;
    }
}

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header is missing
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing or malformed!"
            });
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);

        // Handle invalid or expired token
        if (!payload) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token!"
            });
        }

        req.user = payload;
        next();

    } catch (error) {
        console.error("Error authenticating :: ", error);
        next(error);
    }
}