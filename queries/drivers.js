const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");

//READ - All Drivers
const getAllDrivers = async () => {
  const drivers = await db.any(`SELECT name, bus_id, email FROM drivers`);
  return drivers;
};

//Read Specific Driver by ID
const getDriverByID = async (id) => {
  const driver = await db.oneOrNone(
    `SELECT * FROM drivers WHERE driver_id=$1`,
    id
  );
  return driver;
};

//Create a New Driver
const createDriver = async (driver) => {
  const { name, license_number, telephone, bus_id, email, password_hash } =
    driver;
  const salt = 10;
  const hash = await bcrypt.hash(password_hash, salt);
  return db.oneOrNone(
    `INSERT INTO drivers (name, license_number, telephone, bus_id, email, password_hash) 
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING *;
         `,
    [name, license_number, telephone, bus_id, email, hash]
  );
};

const loginDriver = async (driver) => {

    const loggedInUser = await db.oneOrNone(
      "SELECT * FROM users WHERE email=$1",
      driver.email
    );
    if (!loggedInUser) return false;
    const passwordMatch = await bcrypt.compare(
      driver.password_hash,
      loggedInUser.password_hash
    );
    if (!passwordMatch) return false;
    return loggedInUser;
 

};

//Update Driver Info
const updateDriver = async (id, driver) => {
  const { password_hash } = driver;
  if (password_hash) {
    const { name, license_number, telephone, bus_id, email, password_hash } =
      driver;
    const salt = 10;
    const hash = await bcrypt.hash(password_hash, salt);
    const update = await db.oneOrNone(
      `UPDATE drivers SET 
      name = $1,
      license_number = $2,
      telephone = $3,
      bus_id = $4,
      email = $5,
      password_hash = $6
      WHERE driver_id = $7
      RETURNING *; `,
      [name, license_number, telephone, bus_id, email, hash, id]
    );
    return update;
  } else {
    const { name, license_number, telephone, bus_id, email } = driver;
    const update = await db.oneOrNone(
      `UPDATE drivers SET
        name = $1,
        license_number = $2,
        telephone = $3,
        bus_id = $4,
        email = $5
        WHERE driver_id = $6
        RETURNING *;  
          `,
      [name, license_number, telephone, bus_id, email, id]
    );
    return update;
  }
};

//Delete Driver by ID
const deleteDriver = async (id) => {
  return db.oneOrNone(`DELETE FROM drivers WHERE driver_id = $1 RETURNING *;`, [
    id,
  ]);
};

module.exports = {
  deleteDriver,
  updateDriver,
  createDriver,
  getAllDrivers,
  getDriverByID,
  loginDriver,
};
