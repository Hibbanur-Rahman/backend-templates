const Teacher = require("../models/teacherModel");

const createTeacher = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const teacher = await Teacher.create({ name, email, password, role });
        res.status(201).json({ message: "Teacher created successfully", teacher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createTeacher };