import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/userControllers.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

//Route for signup

userRouter.post("/signup", signup);

//Route for login

userRouter.post("/login", login);

//Route for update profile

userRouter.put("/update-profile", protectRoute, updateProfile);

//Check authentication
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;