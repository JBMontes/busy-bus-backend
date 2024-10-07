const db = require("../db/dbConfig");

const createStudent = async (student) => {
  const { name, parent_id, school, medical_history, bus_id } = student;
  return db.oneOrNone(
    `INSERT INTO students (name,parent_id,school,medical_history,bus_id) VALUES($1,$2,$3,$4,$5,$6)
    RETURNING *;`,
    [name, parent_id, school, medical_history, bus_id]
  );
};

const updateStudent = async (id, student) => {
  const { name, parent_id, school, medical_history, bus_id } = student;

  return db.oneOrNone(
    `UPDATE students SET
        name = $1,
        parent_id = $2,
        school = $3,
        medical_history =$4,
        bus_id =$5
        WHERE student_id = $6
        RETURNING *;`,
    [name, parent_id, school, medical_history, bus_id, id]
  );
};

const deleteStudent = async (id) => {
  return db.oneOrNone(
    `DELETE FROM students WHERE student_id = $1 RETURNING *;`,
    [id]
  );
};

const getAllStudentsByBusID = async (bus_id) => {
  return db.any(`SELECT name FROM students WHERE bus_id = $1`, [bus_id]);
};

const getStudentByID = async (id) => {
  return db.oneOrNone(`SELECT * FROM students WHERE student_id = $1`, [id]);
};

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudentsByBusID,
  getStudentByID,
};
