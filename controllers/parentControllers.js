const express = require("express");
const parents = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const {
  checkRequiredFields,
  validateEmail,
  checkDuplicateEmail,
  validatePhoneNumber,
  validateLoginInput,
  isValidID,
  checkDuplicatePhoneNumber,
} = require("../validations/checkParent");

const {
  createParent,
  updateParent,
  deleteParent,
  loginParent,
  getParentByID,
} = require("../queries/parents");

// const { authenticateToken } = require("../auth/auth");
// bus.use(authenticateToken);

parents.get("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await getParentByID(id);
    if (!parent) {
      return res.status(404).json({ error: `Parent ID: ${id} not found.` });
    }
    return res.status(200).json(parent);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

parents.post(
  "/sign-up",
  validateEmail,
  checkDuplicateEmail,
  validatePhoneNumber,
  validateLoginInput,
  isValidID,
  checkDuplicatePhoneNumber,
  async (req, res) => {
    try {
      const newParent = await createParent(req.body);
      const token = jwt.sign(
        {
          parent_id: newParent.parent_id,
          name: newParent.name,
          email: newParent.email,
        },
        secret
      );
      return res.status(201).json({ parent: newParent, token });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

parents.post(`/login`, checkRequiredFields, async (req, res) => {
  try {
    const parent = await loginParent(req.body);
    if (!parent) {
      return res.status(400).json({ error: `Invalid email or password.` });
    }
    const token = jwt.sign(
      {
        parent_id: parent.parent_id,
        name: parent.name,
        email: parent.email,
      },
      secret
    );
    return res.status(200).json({
      parent: {
        parent_id: parent.parent_id,
        name: parent.name,
        telephone: parent.telephone,
        address: parent.address,
        bus_id: parent.bus_id,
        email: parent.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

parents.delete("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const removeParent = await deleteParent(id);

    if (!removeParent) {
      return res.status(404).json({ error: `Parent ID: ${id} not found` });
    }
    return res.status(200).json({ data: removeParent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

parents.put("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const validParentByID = await getParentByID(id);
    if (!validParentByID) {
      return res.status(404).json({ error: `Parent ID: ${id} not found.` });
    }
    const update = req.body;
    const updatedParent = await updateParent(id, update);
    return res.status(200).json({ data: updatedParent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = parents;
