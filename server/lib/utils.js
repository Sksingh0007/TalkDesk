import jwt from "jsonwebtoken";


//Finction to generate JWT token for a user

export const generateToken = (userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" })
    return token;
}