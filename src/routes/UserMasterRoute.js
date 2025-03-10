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
 *     description: This endpoint registers a new user with the provided details such as name, email, password, and mobile number. Optionally, a party ID, role, and profile image can also be provided.
 *     tags: [UserMaster]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object that needs to be registered.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             Name:
 *               type: string
 *               example: "John Doe"
 *               description: Name of the user (required, max length 200 characters).
 *             EmailId:
 *               type: string
 *               example: "john.doe@example.com"
 *               description: Email address of the user (required, max length 150 characters, must be a valid email format).
 *             Pwd:
 *               type: string
 *               example: "password123"
 *               description: Password of the user (required, minimum length 6 characters).
 *             MobileNumber:
 *               type: string
 *               example: "1234567890"
 *               description: Mobile number of the user (required, must be 10-15 digits).
 *             PartyId:
 *               type: number
 *               example: 1
 *               description: Optional Party ID (must be a valid number).
 *             role:
 *               type: string
 *               example: "user"
 *               description: Role of the user (optional, defaults to "user").
 *             profileImage:
 *               type: string
 *               example: "https://example.com/profile.jpg"
 *               description: Profile image URL (optional).
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
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 user:
 *                   type: object
 *                   properties:
 *                     Name:
 *                       type: string
 *                       example: "John Doe"
 *                     EmailId:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     MobileNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     PartyId:
 *                       type: number
 *                       example: 1
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     profileImage:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *       400:
 *         description: Bad request (e.g., email already in use or invalid password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password must be at least 6 characters long"
 *       500:
 *         description: Server error
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
  const {
    Name,
    EmailId,
    Pwd,
    MobileNumber,
    PartyId,
    role = "user",
    profileImage,
  } = req.body;
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
      PartyId,
      role,
      profileImage,
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      statusCode: res.statusCode,
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
 *     summary: Login a user
 *     description: This endpoint authenticates a user by their email and password. Upon successful authentication, a JWT token is generated.
 *     tags: [UserMaster]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: credentials
 *         description: User's login credentials (email and password).
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             EmailId:
 *               type: string
 *               example: "john.doe@example.com"
 *               description: Email address of the user (required).
 *             Pwd:
 *               type: string
 *               example: "password123"
 *               description: Password of the user (required).
 *     responses:
 *       200:
 *         description: User successfully logged in
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
 *                   example: "jwt_token_example"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     mobile:
 *                       type: string
 *                       example: "1234567890"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     PartyId:
 *                       type: number
 *                       example: 1
 *                     profileImage:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *       400:
 *         description: Invalid credentials (e.g., email or password is incorrect)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         description: Server error
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
    const userResponse = {
      id: user._id,
      name: user.Name,
      email: user.EmailId,
      mobile: user.MobileNumber,
      role: user.role,
      PartyId: user.PartyId || null, // Include default null if PartyId is not present
      profileImage: user.profileImage || null, // Include default null if profileImage is not present
    };

    res.status(200).json({
      message: "Login successful",
      token,
      statusCode: res.statusCode,
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: This endpoint retrieves user details by user ID.
 *     tags: [UserMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1e8d5b8b2f5e22"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60c72b2f9b1e8d5b8b2f5e22"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 mobile:
 *                   type: string
 *                   example: "1234567890"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 PartyId:
 *                   type: number
 *                   example: 1
 *                 profileImage:
 *                   type: string
 *                   example: "https://example.com/profile.jpg"
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by their ID
    const user = await UserMaster.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user details
    const userResponse = {
      id: user._id,
      name: user.Name,
      email: user.EmailId,
      mobile: user.MobileNumber,
      role: user.role,
      PartyId: user.PartyId || null,
      profileImage: user.profileImage || null,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
