const express = require("express");
const students = express.Router();
require("dotenv").config();

const {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByID,
} = require("../queries/students");

const { isValidID } = require("../validations/checkStudent");

students.get("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const student = await getStudentByID(id);
    if (!student) {
      return res.status(404).json({ error: `Student ID: ${id} not found.` });
    }
    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

students.post("/", async (req, res) => {
  try {
    const newStudent = await createStudent(req.body);
    res.status(201).json({ student: newStudent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

students.delete("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const removedStudent = await deleteStudent(id);
    if (!removedStudent) {
      return res.status(404).json({ error: `Student ID: ${id} not found.` });
    }
    return res.status(200).json({ message: `Student successfully deleted.` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

students.put("/:id", isValidID, async (req, res) => {
  try {
    const { id } = req.params;
    const isValidStudentId = await getStudentByID(id);
    if (!isValidStudentId) {
      return res.status(404).json({ error: `Student ID: ${id} not found.` });
    }
    const update = req.body;
    const updatedStudent = await updateStudent(id, update);
    return res.status(200).json({ data: updatedStudent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = students;
