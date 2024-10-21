import User from '../../models/User.js';

// register user
export const registerUser = async (req, res) => {
    try {
        const { userName, userEmail, password, role } = req.body;

        // check req body validation
        if (!userName || !userEmail || !password) return res.status(400).json({
            success: false,
            message: "All fields (userName, userEmail, password) are required!",
        });

        // check user is already registered or not
        const existingUser = await User.findOne({ $or: [{ userName }, { userEmail }] });

        if (existingUser) return res.status(400).json({
            success: false,
            message: "userName or userEmail already exists!",
        });

        // before saving the data password will hashed in user model already
        const newUser = new User({ userName, userEmail, password, role });
        await newUser.save();

        // Remove the password field from the response object
        const userResponse = newUser.toObject(); // Convert Mongoose document to plain object
        delete userResponse.password; // Remove password field

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse
        });

    } catch (error) {
        console.error("REGISTER USER ERROR ::", error);
        next(error || error.message);
    }
}