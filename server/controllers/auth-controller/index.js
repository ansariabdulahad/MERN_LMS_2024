import User from '../../models/User.js';

// register user
export const registerUser = async (req, res, next) => {
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
            message: "User registered successfully, Login now!",
            data: userResponse
        });

    } catch (error) {
        console.error("REGISTER USER ERROR ::", error);
        next(error || error.message);
    }
};

// login user
export const loginUser = async (req, res, next) => {
    try {
        const { userEmail, password } = req.body;

        // validate inputs
        if (!userEmail || !password) return res.status(400).json({
            success: false,
            message: "All fields (userEmail, password) are required!"
        });

        // check user existence & password validity
        const checkUser = await User.findOne({ userEmail });

        if (!checkUser || !(await checkUser.compareHashPassword(password))) return res.status(401).json({
            success: false,
            message: "Invalid credentials!"
        });

        // loggedin the user and send token to client
        const accessToken = await checkUser.generateAccessToken();

        if (!accessToken) return res.status(500).json({
            success: false,
            message: 'Failed to generate access token!'
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully!',
            data: {
                accessToken,
                user: {
                    _id: checkUser._id,
                    userName: checkUser.userName,
                    userEmail: checkUser.userEmail,
                    role: checkUser.role
                }
            }
        });

    } catch (error) {
        console.error("LOGIN USER ERROR :: ", error);
        next(error || error.message);
    }
}