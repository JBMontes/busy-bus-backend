const express = require("express");
const matrons = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const {
  getAllMatrons,
  getMatronByID,
  deleteMatron,
  updateMatron,
  createMatron,
  loginMatron,
} = require("../queries/matrons");

const {
  checkRequiredFields,
  validateEmail,
  checkDuplicateEmail,
  validatePhoneNumber,
  validateLoginInput,
  checkDuplicatePhoneNumber,
  isValidID,
} = require("../validations/checkMatron");

// const { authenticateToken } = require("../auth/auth");
// bus.use(authenticateToken);

// Get all matrons
matrons.get("/", async (req, res) => {
  try {
    const matrons = await getAllMatrons();
    return res.status(200).json(matrons);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//get matron by ID
matrons.get("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const matron = await getMatronByID(id);
    if (!matron) {
      return res.status(404).json({ error: `Matron id: ${id} not found.` });
    }
    return res.status(200).json(matron);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Sign-up route for new matrons
matrons.post(
  "/sign-up",
  checkRequiredFields,
  validateEmail,
  checkDuplicateEmail,
  checkDuplicatePhoneNumber,
  validatePhoneNumber,
  isValidID,
  async (req, res) => {
    try {
      const newMatron = await createMatron(req.body);
      const token = jwt.sign(
        {
          matron_id: newMatron.matron_id,
          name: newMatron.name,
          email: newMatron.email,
        },
        secret
      );
      return res.status(201).json({ matron: newMatron, token });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// Login route for matrons
matrons.post("/login", validateLoginInput, async (req, res) => {
  try {
    const matron = await loginMatron(req.body);
    if (!matron) {
      return res.status(400).json({ error: `Invalid email or password.` });
    }
    const token = jwt.sign(
      {
        matron_id: matron.matron_id,
        name: matron.name,
        email: matron.email,
      },
      secret
    );

    return res.status(200).json({
      matron: {
        matron_id: matron.matron_id,
        name: matron.name,
        telephone: matron.telephone,
        bus_id: matron.bus_id,
        work_id: matron.work_id,
        company: matron.company,
        school: matron.school,
        email: matron.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update a matron by ID
matrons.put("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const validMatronByID = await getMatronByID(id);
    if (!validMatronByID) {
      return res.status(404).json({ error: `Matron id: ${id} not found.` });
    }
    const update = req.body;
    const updatedMatron = await updateMatron(id, update);
    return res.status(200).json({ data: updatedMatron });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete a matron by ID
matrons.delete("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const removeMatron = await deleteMatron(id);
    if (!removeMatron) {
      return res.status(404).json({ error: `Matron ID: ${id} not found` });
    }
    res.status(200).json({ data: removeMatron });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = matrons;
