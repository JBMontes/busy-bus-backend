const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");

const getParentByID = async (id) => {
  return db.any(`SELECT * FROM parents WHERE parent_id=$1`, [id]);
};

const createParent = async (parent) => {
  const { name, telephone, address, bus_id, email, password_hash } = parent;
  const salt = 10;
  const hash = await bcrypt.hash(password_hash, salt);
  const newUser = await db.oneOrNone(
    `INSERT INTO parents (name, telephone, address, bus_id, email, password_hash)
    VALUES($1,$2,$3,$4,$5,$6) RETURNING *;
    `,
    [name, telephone, address, bus_id, email, hash]
  );
  return newUser;
};

const loginParent = async (parent) => {
  const loggedInParent = await db.oneOrNone(
    `SELECT * FROM parents WHERE email=$1`,
    parent.email
  );
  if (!loggedInParent) return false;
  const passwordMatch = await bcrypt.compare(
    parent.password_hash,
    loggedInParent.password_hash
  );
  if (!passwordMatch) return false;
  return loggedInParent;
};

const updateParent = async (id, parent) => {
  const { password_hash } = parent;
  if (password_hash) {
    const { name, telephone, address, bus_id, email, password_hash } = parent;
    const salt = 10;
    const hash = await bcrypt.hash(password_hash, salt);
    const update = await db.oneOrNone(
      `UPDATE parents SET
          name =$1,
          telephone =$2,
          address=$3,
          bus_id=$4,
          email = $5,
          password_hash = $6 WHERE parent_id=$7 RETURNING *;`,
      [name, telephone, address, bus_id, email, hash, id]
    );
    return update;
  } else {
    const { name, telephone, address, bus_id, email } = parent;
    const update = await db.oneOrNone(
      `UPDATE parents SET
          name =$1,
          telephone =$2,
         address=$3,
          bus_id=$4,
          email = $5 WHERE parent_id=$6 RETURNING *;`,
      [name, telephone, address, bus_id, email, id]
    );
    return update;
  }
};

const deleteParent = async (id) => {
  return db.oneOrNone(`DELETE FROM parents WHERE parent_id = $1 RETURNING *;`, [
    id,
  ]);
};

module.exports = {
  createParent,
  updateParent,
  deleteParent,
  loginParent,
  getParentByID,
};
