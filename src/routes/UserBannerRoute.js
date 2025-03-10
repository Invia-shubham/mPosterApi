const express = require("express");
const UserBanner = require("../models/UserBannerSchema");

const router = express.Router();

/**
 * @swagger
 * /api/userBanners:
 *   post:
 *     summary: Create a new user banner
 *     description: This endpoint allows the creation of a new banner for a user with the provided details.
 *     tags: [UserBanner]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: banner
 *         description: Banner object that needs to be created.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             BannerCode:
 *               type: string
 *               example: "BANNER123"
 *               description: Unique identifier for the banner.
 *             UserId:
 *               type: string
 *               example: "60d6f7c3c1a3f567e8a1b2f3"
 *               description: User ID associated with the banner.
 *             Title:
 *               type: string
 *               example: "Special Offer"
 *               description: Title of the banner.
 *             Description:
 *               type: string
 *               example: "50% off on all items"
 *               description: Description of the banner.
 *     responses:
 *       201:
 *         description: Banner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Banner created successfully"
 *                 banner:
 *                   type: object
 *                   properties:
 *                     BannerCode:
 *                       type: string
 *                       example: "BANNER123"
 *                     UserId:
 *                       type: string
 *                       example: "60d6f7c3c1a3f567e8a1b2f3"
 *                     Title:
 *                       type: string
 *                       example: "Special Offer"
 *                     Description:
 *                       type: string
 *                       example: "50% off on all items"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating banner"
 */
router.post("/userBanners", async (req, res) => {
  const { BannerCode, UserId, Title, Description } = req.body;

  try {
    const newBanner = new UserBanner({
      BannerCode,
      UserId,
      Title,
      Description,
    });

    await newBanner.save();
    res
      .status(201)
      .json({ message: "Banner created successfully", banner: newBanner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating banner" });
  }
});

// Route to get all banners
/**
 * @swagger
 * /api/userBanners:
 *   get:
 *     summary: Get all banners
 *     description: This endpoint retrieves all banners in the system.
 *     tags: [UserBanner]
 *     responses:
 *       200:
 *         description: List of all banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   BannerCode:
 *                     type: string
 *                     example: "BANNER123"
 *                   UserId:
 *                     type: string
 *                     example: "60d6f7c3c1a3f567e8a1b2f3"
 *                   Title:
 *                     type: string
 *                     example: "Special Offer"
 *                   Description:
 *                     type: string
 *                     example: "50% off on all items"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching banners"
 */
router.get("/userBanners", async (req, res) => {
  try {
    const banners = await UserBanner.find(); // Example to populate UserId with user details
    res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching banners" });
  }
});

// Route to get a banner by its ID
/**
 * @swagger
 * /api/userBanners/{id}:
 *   get:
 *     summary: Get a banner by ID
 *     description: This endpoint retrieves a specific banner by its unique ID.
 *     tags: [UserBanner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the banner to retrieve.
 *         schema:
 *           type: string
 *           example: "60d6f7c3c1a3f567e8a1b2f3"
 *     responses:
 *       200:
 *         description: Banner found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 BannerCode:
 *                   type: string
 *                   example: "BANNER123"
 *                 UserId:
 *                   type: string
 *                   example: "60d6f7c3c1a3f567e8a1b2f3"
 *                 Title:
 *                   type: string
 *                   example: "Special Offer"
 *                 Description:
 *                   type: string
 *                   example: "50% off on all items"
 *       404:
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Banner not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching banner"
 */

router.get("/userBanners/:id", async (req, res) => {
  try {
    const banner = await UserBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching banner" });
  }
});

// Route to get banners by user ID
/**
 * @swagger
 * /api/userBanners/user/{userId}:
 *   get:
 *     summary: Get banners by user ID
 *     description: This endpoint retrieves all banners for a specific user by their user ID.
 *     tags: [UserBanner]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve banners for.
 *         schema:
 *           type: string
 *           example: "60d6f7c3c1a3f567e8a1b2f3"
 *     responses:
 *       200:
 *         description: List of banners for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   BannerCode:
 *                     type: string
 *                     example: "BANNER123"
 *                   UserId:
 *                     type: string
 *                     example: "60d6f7c3c1a3f567e8a1b2f3"
 *                   Title:
 *                     type: string
 *                     example: "Special Offer"
 *                   Description:
 *                     type: string
 *                     example: "50% off on all items"
 *       404:
 *         description: No banners found for this user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No banners found for this user"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching banners by user ID"
 */

router.get("/userBanners/user/:userId", async (req, res) => {
  try {
    const banners = await UserBanner.find({
      UserId: req.params.userId,
    });
    if (banners.length === 0) {
      return res
        .status(404)
        .json({ message: "No banners found for this user" });
    }
    res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching banners by user ID" });
  }
});

// Route to update a banner by its ID
/**
 * @swagger
 * /api/userBanners/{id}:
 *   put:
 *     summary: Update a banner by ID
 *     description: This endpoint updates the banner with the specified ID.
 *     tags: [UserBanner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the banner to update.
 *         schema:
 *           type: string
 *           example: "60d6f7c3c1a3f567e8a1b2f3"
 *       - in: body
 *         name: banner
 *         description: Banner object that needs to be updated.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             BannerCode:
 *               type: string
 *               example: "BANNER123"
 *             UserId:
 *               type: string
 *               example: "60d6f7c3c1a3f567e8a1b2f3"
 *             Title:
 *               type: string
 *               example: "Updated Special Offer"
 *             Description:
 *               type: string
 *               example: "60% off on all items"
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Banner updated successfully"
 *                 banner:
 *                   type: object
 *                   properties:
 *                     BannerCode:
 *                       type: string
 *                       example: "BANNER123"
 *                     UserId:
 *                       type: string
 *                       example: "60d6f7c3c1a3f567e8a1b2f3"
 *                     Title:
 *                       type: string
 *                       example: "Updated Special Offer"
 *                     Description:
 *                       type: string
 *                       example: "60% off on all items"
 *       404:
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Banner not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating banner"
 */

router.put("/userBanners/:id", async (req, res) => {
  const { BannerCode, UserId, Title, Description } = req.body;

  try {
    const updatedBanner = await UserBanner.findByIdAndUpdate(
      req.params.id,
      { BannerCode, UserId, Title, Description },
      { new: true } // Return the updated document
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res
      .status(200)
      .json({ message: "Banner updated successfully", banner: updatedBanner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating banner" });
  }
});
module.exports = router;
