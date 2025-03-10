const express = require("express");
const PartyList = require("../models/PartyListSchema");
const router = express.Router();

/**
 * @swagger
 * /api/partyLists:
 *   post:
 *     summary: Create a new Party
 *     description: Create a new party with the details provided.
 *     tags: [PartyLists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartyList'
 *     responses:
 *       201:
 *         description: Party created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartyList'
 *       400:
 *         description: Invalid request
 */
router.post("/partyLists", async (req, res) => {
  try {
    const newParty = new PartyList(req.body);
    const savedParty = await newParty.save();
    res.status(201).json(savedParty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/partyLists:
 *   get:
 *     summary: Get all Party Lists
 *     description: Retrieve all party details from the database.
 *     tags: [PartyLists]
 *     responses:
 *       200:
 *         description: A list of parties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PartyList'
 *       400:
 *         description: Error fetching parties
 */
router.get("/partyLists", async (req, res) => {
  try {
    const partyLists = await PartyList.find();
    res.status(200).json(partyLists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/partyLists/{id}:
 *   get:
 *     summary: Get a specific Party by ID
 *     description: Retrieve a single party using its unique ID.
 *     tags: [PartyLists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the party
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Party details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartyList'
 *       404:
 *         description: Party not found
 */
router.get("/partyLists/:id", async (req, res) => {
  try {
    const party = await PartyList.findById(req.params.id);
    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }
    res.status(200).json(party);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/partyLists/{id}:
 *   put:
 *     summary: Update a Party by ID
 *     description: Update the details of an existing party.
 *     tags: [PartyLists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the party to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartyList'
 *     responses:
 *       200:
 *         description: Party updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartyList'
 *       404:
 *         description: Party not found
 *       400:
 *         description: Invalid request
 */
router.put("/partyLists/:id", async (req, res) => {
  try {
    const updatedParty = await PartyList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedParty) {
      return res.status(404).json({ message: "Party not found" });
    }
    res.status(200).json(updatedParty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/partyLists/{id}:
 *   delete:
 *     summary: Delete a Party by ID
 *     description: Delete a specific party by its ID.
 *     tags: [PartyLists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the party to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Party deleted successfully
 *       404:
 *         description: Party not found
 */
router.delete("/partyLists/:id", async (req, res) => {
  try {
    const deletedParty = await PartyList.findByIdAndDelete(req.params.id);
    if (!deletedParty) {
      return res.status(404).json({ message: "Party not found" });
    }
    res.status(200).json({ message: "Party deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
