const express = require("express");
const drivers = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

// const { authenticateToken } = require("../auth/auth");
// bus.use(authenticateToken);

const {
  loginDriver,
  deleteDriver,
  updateDriver,
  createDriver,
  getAllDrivers,
  getDriverByID,
} = require("../queries/drivers");

const {
  isValidLicense,
  checkDuplicatePhoneNumber,
  isValidID,
  validateLoginInput,
  checkDuplicateEmail,
  validatePhoneNumber,
  validateEmail,
  checkRequiredFields,
} = require("../validations/checkDriver");

drivers.get("/", async (req, res) => {
  try {
    const driver = await getAllDrivers();
    res.status(200).json({ driver: driver });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

drivers.get("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await getDriverByID(id);
    if (!driver) {
      return res.status(404).json({ error: `Driver ID: ${id} not found.` });
    }
    return res.status(200).json(driver);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

drivers.post(
  "/sign-up",
  checkDuplicateEmail,
  validatePhoneNumber,
  validateEmail,
  checkRequiredFields,
  isValidLicense,
  checkDuplicatePhoneNumber,
  async (req, res) => {
    try {
      const newDriver = await createDriver(req.body);
      const token = jwt.sign(
        {
          driver_id: newDriver.driver_id,
          name: newDriver.name,
          email: newDriver.email,
        },
        secret
      );
      res.status(201).json({ driver: newDriver, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


drivers.post(`/login`, validateLoginInput, async (req, res) => {
  try {
    const driver = await loginDriver(req.body);
    if (!driver) {
      res.status(400).json({ error: `Invalid email or password.` });
    }
    const token = jwt.sign(
      {
        driver_id: driver.driver_id,
        name: driver.name,
        email: driver.email,
      },
      secret
    );
    return res.status(200).json({
      driver: {
        driver_id: driver.driver_id,
        name: driver.name,
        license_number: driver.license_number,
        telephone: driver.telephone,
        bus_id: driver.bus_id,
        email: driver.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

drivers.put("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const validDriverByID = await getAllDrivers(id);
    if (!validDriverByID) {
      res.status(404).json({ error: `Driver ID: ${id} not found.` });
    }
    const update = req.body;
    const updatedDriver = await updateDriver(id, update);
    return res.status(200).json({ data: updatedDriver });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

drivers.delete("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const removeDriver = await deleteDriver(id);

    if (!removeDriver) {
      return res.status(404).json({ error: `Driver ID:  ${id} not found.` });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = drivers;
