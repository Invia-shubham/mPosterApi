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
 *     description: Registers a new user with the provided details including Name, Email, Password, Mobile Number, Party ID, and Profile Image.
 *     tags:
 *       - UserMaster
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "John Doe"
 *               EmailId:
 *                 type: string
 *                 description: Email address of the user
 *                 example: "john.doe@example.com"
 *               Pwd:
 *                 type: string
 *                 description: Password for the user account
 *                 example: "Password123"
 *               MobileNumber:
 *                 type: string
 *                 description: Mobile number of the user
 *                 example: "1234567890"
 *               PartyId:
 *                 type: number
 *                 description: Party ID to associate the user with
 *                 example: 1
 *               role:
 *                 type: string
 *                 description: Role of the user (default is "user")
 *                 example: "user"
 *               profileImage:
 *                 type: string
 *                 description: URL or path to the user's profile image
 *                 example: "https://example.com/profile-image.jpg"
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                       type: string
 *                       example: "party123"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     profileImage:
 *                       type: string
 *                       example: "https://example.com/profile-image.jpg"
 *       400:
 *         description: Bad Request - Invalid input or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password must be at least 6 characters long"
 *       500:
 *         description: Internal Server Error
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

//Get all user
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     description: Retrieves all users from the database.
 *     tags: [UserMaster]
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the user
 *                   Name:
 *                     type: string
 *                     description: The name of the user
 *                   EmailId:
 *                     type: string
 *                     description: The email address of the user
 *                   MobileNumber:
 *                     type: string
 *                     description: The mobile number of the user
 *                   PartyId:
 *                     type: integer
 *                     description: The party ID associated with the user
 *                   role:
 *                     type: string
 *                     description: The role of the user (e.g., "user" or "admin")
 *                   profileImage:
 *                     type: string
 *                     description: URL for the user's profile image
 *       500:
 *         description: Server error
 */
router.get("/users", async (req, res) => {
  try {
    const User = await UserMaster.find();
    res.status(200).json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching banners" });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user by verifying the provided credentials (EmailId and Password), then returns a JWT token and user details upon successful login.
 *     tags:
 *       - UserMaster
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EmailId:
 *                 type: string
 *                 description: The email address of the user
 *                 example: "john.doe@example.com"
 *               Pwd:
 *                 type: string
 *                 description: The password for the user account
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Successful login
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
 *                   description: The JWT token to be used for authentication in future requests
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60f5f9a233d2e2a3a1b9dcd1"
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
 *                       nullable: true
 *                       example: 1
 *                     profileImage:
 *                       type: string
 *                       nullable: true
 *                       example: "https://example.com/profile-image.jpg"
 *       400:
 *         description: Invalid credentials (either user not found or password mismatch)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         description: Internal Server Error
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
    console.log("Received credentials:", { EmailId, Pwd });

    const user = await UserMaster.findOne({ EmailId });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Comparing the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(Pwd, user.Pwd);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("User authenticated successfully");
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

// Update user by userId
/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Update a user by userId
 *     description: Update user data such as name, email, password, etc., by userId.
 *     tags: [UserMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: The name of the user
 *               EmailId:
 *                 type: string
 *                 description: The email address of the user
 *               Pwd:
 *                 type: string
 *                 description: The password of the user
 *               MobileNumber:
 *                 type: string
 *                 description: The mobile number of the user
 *               PartyId:
 *                 type: integer
 *                 description: The party ID associated with the user
 *               role:
 *                 type: string
 *                 description: The role of the user (e.g., "user" or "admin")
 *               profileImage:
 *                 type: string
 *                 description: URL for the user's profile image
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the user
 *                     Name:
 *                       type: string
 *                     EmailId:
 *                       type: string
 *                     MobileNumber:
 *                       type: string
 *                     PartyId:
 *                       type: integer
 *                     role:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/users/update/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameter
  const { Name, EmailId, Pwd, MobileNumber, PartyId, role, profileImage } =
    req.body;

  try {
    // Find the user by userId
    const user = await UserMaster.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // // Update the user fields if provided
    if (Name) user.Name = Name;
    if (EmailId) user.EmailId = EmailId;
    if (Pwd) user.Pwd = Pwd; // Make sure to hash the password if it's updated
    if (MobileNumber) user.MobileNumber = MobileNumber;
    if (PartyId) user.PartyId = PartyId;
    if (role) user.role = role;
    if (profileImage) user.profileImage = profileImage;

    // If the password is modified, hash it before saving
    if (Pwd) {
      user.Pwd = await bcrypt.hash(Pwd, 10);
    }

    // Save the updated user
    await user.save();

    // Respond with the updated user
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
