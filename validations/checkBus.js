const db = require("../db/dbConfig");

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
  isValidID,
};
