const express = require("express");
const bus = express.Router();
const {
  getAllBuses,
  deleteBus,
  getBusByID,
  createBus,
} = require("../queries/bus");

const { isValidID } = require("../validations/checkBus");

// const { authenticateToken } = require("../auth/auth");
// bus.use(authenticateToken);

bus.post("/", async (req, res) => {
  try {
    const newBus = await createBus(req.body);
    res.status(201).json({ bus: newBus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

bus.get("/", async (req, res) => {
  try {
    const buses = await getAllBuses();
    res.status(200).json({ data: buses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

bus.get("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await getBusByID(id);

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

bus.delete("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteBus(id);
    res.status(200).json({ message: "Bus successfully deleted." }); 
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = bus;
