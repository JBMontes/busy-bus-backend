const db = require("../db/dbConfig");

const checkRequiredFields = (req, res, next) => {
  const { name, parent_id, school, medical_history, bus_id } = req.body;
  if (name && parent_id && school && medical_history && bus_id) {
    next();
  } else {
    res.status(400).json({ error: `All required fields must be provided` });
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

module.exports = {
  checkRequiredFields,
  isValidID,
};
