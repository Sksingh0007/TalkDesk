import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

//Signup a new user

export const signup = async (req, res) => {
  try {
    //getting data from re.body
    const { email, fullName, password, profilePic, bio } = req.body;
    // Validating data
    if (!email || !fullName || !password || !bio) {
      return res.status(400).json({
        message: "Please fill all the required fields",
      });
    }
    //check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email alrady exists",
      });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating a new user
    const user = await User.create({
      email,
      fullName,
      password: hashedPassword,
      bio,
    });
    //Generating JWT token
    const token = generateToken(user._id);

    //Sending response
    res.json.status(201).json({
      success: true,
      userData: user,
      token,
      message: "User Account created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Controller to Login a user

export const login = async (req, res) => {
    try {
        //getting data from re.body
        const { email, password } = req.body;
        //Validating data
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the required fields"
            })
        }
        //Check if the user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User with this email does not exists"
            })
        }
        //Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Incorrect password"
            })
        }
        //Gennerating JWT token
        const token = generateToken(user._id);
        //Sending response
        res.status(200).json({
            success: true,
            userData: user,
            token,
            message: "User logged in successfully",
        })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


//Controller to check if user is authenticated i.e. if he can log in

export const checkAuth = (req, res) => {
    res.status(200).json({success: true, user :req.user,message:"User is authenticated"})
}

//Controllers to update user profile details

const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;

        //It will be protected by route so re.body will contain user info as passed by middleware
        const userId = req.user._id;
        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, {bio,fullName},{new:true})
        }
        else {
            const upload = await cloudinary.uploader.upload(profilePic)

            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true })
            
        }
        //Sending response
        res.status(201).json({success: true, user: updatedUser})
    } catch (error) {
        
    }
}