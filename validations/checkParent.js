const db = require("../db/dbConfig");

const checkRequiredFields = (req, res, next) => {
  const { name, telephone, address, bus_id, email, password_hash } = req.body;
  if (name && telephone && address && bus_id && email && password_hash) {
    next();
  } else {
    res.status(400).json({ error: `All required fields must be provided` });
  }
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    next();
  } else {
    res.status(400).json({ error: "Invalid email format" });
  }
};

const validatePhoneNumber = (req, res, next) => {
  const { telephone } = req.body;
  const sanitizedPhoneNumber = telephone.replace(/\D/g, "");

  if (sanitizedPhoneNumber.length >= 10) {
    next();
  } else {
    res.status(400).json({ error: "Invalid phone number format" });
  }
};

const checkDuplicateEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await db.oneOrNone(
      "SELECT * FROM parents WHERE LOWER(email) = LOWER($1)",
      email
    );
    if (existingUser) {
      return res.status(400).json({ error: "Email is already taken" });
    }
    next();
  } catch (err) {
    console.error("Error checking duplicate email:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const validateLoginInput = (req, res, next) => {
  const { email, password_hash } = req.body;
  if (!email || !password_hash) {
    res.status(400).json({ error: "Email and password are required" });
  } else {
    next();
  }
};

const isValidID = (req, res, next) => {
  const { id } = req.params;
  const idAsNum = Number(id);

  if (!Number(idAsNum) && idAsNum <= 0) {
    return res
      .status(400)
      .json({ error: `ID: ${id} must be a positive number.` });
  }
  req.id = idAsNum;
  next();
};

const checkDuplicatePhoneNumber = async (req, res, next) => {
  const { telephone } = req.body;
  try {
    const existingUser = await db.oneOrNone(
      "SELECT * FROM parents WHERE telephone = $1",
      telephone
    );
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Phone number is already registered" });
    }
    next();
  } catch (err) {
    console.error("Error checking duplicate phone number:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  checkRequiredFields,
  validateEmail,
  checkDuplicateEmail,
  validatePhoneNumber,
  validateLoginInput,
  isValidID,
  checkDuplicatePhoneNumber,
};
