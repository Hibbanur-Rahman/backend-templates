const router = require("express").Router();
const { createTeacher } = require("../controller/teacherController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create-teacher", verifyToken,createTeacher);

module.exports = router;
