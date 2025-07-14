import jwt from "jsonwebtoken";
import User from "../models/user.js";

//Middleware to protect routee

export const protectRoute = async (req, res, next) => {
    try {
        //Checking if the token is present in the req headers
        const token = req.headers.token
        if (!token) {
            return res.status(401).json({
                message: "You are not authorized to access this route , no token present"
            })
        }
        //Verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message:"Invalid token"
            })
        }

        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        req.user = user; // Attaching user to the request object
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        return res.status(500).json({
            message: "You are not authorized to access this route"
        })
    }
}