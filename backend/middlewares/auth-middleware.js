import jwt from 'jsonwebtoken'
import User from "../models/user.js"

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = req.headers.authorization.split(" ")[1]; // Bearer {Token}
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(401).json({
                message: "Token not verified"
            })
        }
        const user = await User.findById(payload.userId);
        if (!user) {
            return res.status(401).json({
                message: "Token not verified"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export default authMiddleware