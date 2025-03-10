const express = require("express");
const UserBanner = require("../models/UserBannerSchema");

const router = express.Router();

// 1. Create a new User Banner
/**
 * @swagger
 * /api/userBanners:
 *   post:
 *     summary: Create a new User Banner
 *     description: Create a new banner by providing the banner details.
 *     tags: [UserBanners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BannerCode:
 *                 type: number
 *               UserId:
 *                 type: number
 *               Title:
 *                 type: string
 *                 maxLength: 150
 *               Description:
 *                 type: string
 *                 maxLength: 400
 *     responses:
 *       201:
 *         description: Banner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserBanner'
 *       400:
 *         description: Invalid input
 */
router.post("/userBanners", async (req, res) => {
  try {
    const newBanner = new UserBanner(req.body);
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Get all User Banners
/**
 * @swagger
 * /api/userBanners:
 *   get:
 *     summary: Get all User Banners
 *     description: Fetch a list of all user banners.
 *     tags: [UserBanners]
 *     responses:
 *       200:
 *         description: List of user banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserBanner'
 *       400:
 *         description: Error fetching banners
 */
router.get("/userBanners", async (req, res) => {
  try {
    const banners = await UserBanner.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Get a specific User Banner by ID
/**
 * @swagger
 * /api/userBanners/{id}:
 *   get:
 *     summary: Get a specific User Banner by ID
 *     description: Fetch a specific banner by its ID.
 *     tags: [UserBanners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user banner
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserBanner'
 *       404:
 *         description: Banner not found
 *       400:
 *         description: Error fetching banner
 */
router.get("/userBanners/:id", async (req, res) => {
  try {
    const banner = await UserBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Update a User Banner by ID
/**
 * @swagger
 * /api/userBanners/{id}:
 *   put:
 *     summary: Update a User Banner by ID
 *     description: Update a specific banner by its ID.
 *     tags: [UserBanners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the banner to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BannerCode:
 *                 type: number
 *               UserId:
 *                 type: number
 *               Title:
 *                 type: string
 *                 maxLength: 150
 *               Description:
 *                 type: string
 *                 maxLength: 400
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserBanner'
 *       404:
 *         description: Banner not found
 *       400:
 *         description: Invalid input
 */
router.put("/userBanners/:id", async (req, res) => {
  try {
    const updatedBanner = await UserBanner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Delete a User Banner by ID
/**
 * @swagger
 * /api/userBanners/{id}:
 *   delete:
 *     summary: Delete a User Banner by ID
 *     description: Delete a specific banner by its ID.
 *     tags: [UserBanners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the banner to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 *       400:
 *         description: Error deleting banner
 */
router.delete("/userBanners/:id", async (req, res) => {
  try {
    const deletedBanner = await UserBanner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;