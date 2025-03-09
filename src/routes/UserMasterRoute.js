const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserMaster = require("../models/UserMasterSchema");

const router = express.Router();
const JWT_SECRET = "key";
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user by providing their full name, email, password, and mobile number.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - EmailId
 *               - Pwd
 *               - MobileNumber
 *             properties:
 *               Name:
 *                 type: string
 *                 description: The user's full name.
 *               EmailId:
 *                 type: string
 *                 description: The user's email address.
 *               Pwd:
 *                 type: string
 *                 description: The user's password. Must be at least 6 characters.
 *               MobileNumber:
 *                 type: string
 *                 description: The user's mobile number.
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     Name:
 *                       type: string
 *                     EmailId:
 *                       type: string
 *                     MobileNumber:
 *                       type: string
 *       400:
 *         description: Invalid input (Email already in use or password too short)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password must be at least 6 characters long"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.post("/register", async (req, res) => {
    const { Name, EmailId, Pwd, MobileNumber } = req.body;
  
    try {
      if (Pwd.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
  
      const userExists = await UserMaster.findOne({ EmailId });
      if (userExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
  
      const hashedPassword = await bcrypt.hash(Pwd, 10);
  
      const newUser = new UserMaster({
        Name,
        EmailId,
        Pwd: hashedPassword,
        MobileNumber,
      });
  
      await newUser.save();
      res.status(201).json({
        message: "User registered successfully",
        statusCode:res.statusCode,
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: This endpoint allows a user to login with their email and password, and receive a JWT token for authentication.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - EmailId
 *               - Pwd
 *             properties:
 *               EmailId:
 *                 type: string
 *                 description: The user's email address.
 *               Pwd:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: The JWT token for authentication.
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid credentials (either email or password is incorrect)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.post("/login", async (req, res) => {
    const { EmailId, Pwd } = req.body;
  
    try {
      const user = await UserMaster.findOne({ EmailId });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Comparing the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(Pwd, user.Pwd);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // If the password matches, generate a JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Respond with success message, the JWT token, and user data
      res.status(200).json({
        message: "Login successful",
        token,
        statusCode:res.statusCode,
        user: {
          name: user.Name,
          email: user.EmailId,
          mobile: user.MobileNumber,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
