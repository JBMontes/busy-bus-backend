const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");

//dev purpose
const getAllMatrons = async () => {
  return db.any(`
    SELECT * FROM matrons`);
};
const getMatronByID = async (id) => {
  return db.any(`SELECT * FROM matrons WHERE matron_id=$1`, [id]);
};

const createMatron = async (matron) => {
  const {
    name,
    telephone,
    bus_id,
    work_id,
    company,
    school,
    email,
    password_hash,
  } = matron;
  const salt = 10;
  const hash = await bcrypt.hash(password_hash, salt);
  const newUser = await db.oneOrNone(
    `INSERT INTO matrons (name,telephone,bus_id,work_id,company,school, email,password_hash)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;
        `,
    [name, telephone, bus_id, work_id, company, school, email, hash]
  );
  return newUser;
};

const loginMatron = async (matron) => {
  const loggedInMatron = await db.oneOrNone(
    `SELECT * FROM matrons WHERE email=$1`,
    matron.email
  );
  if (!loggedInMatron) return false;
  const passwordMatch = await bcrypt.compare(
    matron.password_hash,
    loggedInMatron.password_hash
  );
  if (!passwordMatch) return false;
  return loggedInMatron;
};

const updateMatron = async (id, matron) => {
  const { password_hash } = matron;
  if (password_hash) {
    const {
      name,
      telephone,
      bus_id,
      work_id,
      company,
      school,
      email,
      password_hash,
    } = matron;
    const salt = 10;
    const hash = await bcrypt.hash(password_hash, salt);
    const update = await db.oneOrNone(
      `UPDATE matrons SET
        name =$1,
        telephone =$2,
        bus_id=$3,
        work_id=$4,
        company=$5,
        school =$6,
        email=$7
        password_hash = $8 WHERE id=$9 RETURNING *;`,
      [name, telephone, bus_id, work_id, company, school, email, hash, id]
    );
    return update;
  } else {
    const { name, telephone, bus_id, work_id, company, school, email } = matron;
    const update = await db.oneOrNone(
      `UPDATE matrons SET
        name =$1,
        telephone =$2,
        bus_id=$3,
        work_id=$4,
        company=$5,
        school =$6,
        email =$7 WHERE matron_id=$8 RETURNING *;`,
      [name, telephone, bus_id, work_id, company, school, email, id]
    );
    return update;
  }
};

const deleteMatron = async (id) => {
  return db.oneOrNone(`DELETE FROM matrons WHERE matron_id = $1 RETURNING *;`, [
    id,
  ]);
};

module.exports = {
  getAllMatrons,
  deleteMatron,
  updateMatron,
  createMatron,
  loginMatron,
  getMatronByID,
};
