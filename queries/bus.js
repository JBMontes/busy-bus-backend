const db = require("../db/dbConfig");

const getAllBuses = async () => {

  return db.any(`SELECT * FROM bus`);
};

const getBusByID = async (id) => {
  return db.oneOrNone(`SELECT * FROM bus WHERE bus_id = $1`, [id]);
};

const deleteBus = async (id) => {
  return db.oneOrNone(`DELETE FROM bus WHERE bus_id = $1 RETURNING *;`, [id]);
};

const createBus = async (bus) => {
  const {name} = bus;
  return db.one(
 `INSERT INTO bus (name) VALUES($1) RETURNING *;`,
 [name]
  )
}

module.exports = {
  getAllBuses,
  deleteBus,
  getBusByID,
  createBus
};
