const router = require("express").Router();
const { createTeacher } = require("../controller/teacherController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - department
 *         - qualification
 *       properties:
 *         name:
 *           type: string
 *           description: Teacher's full name
 *         email:
 *           type: string
 *           format: email
 *           description: Teacher's email address
 *         department:
 *           type: string
 *           description: Teacher's department
 *         qualification:
 *           type: string
 *           description: Teacher's qualification
 *         phone:
 *           type: string
 *           description: Teacher's phone number
 *         address:
 *           type: string
 *           description: Teacher's address
 *         experience:
 *           type: number
 *           description: Years of teaching experience
 *         image:
 *           type: string
 *           description: URL to teacher's profile image
 */

/**
 * @swagger
 * /teacher/create-teacher:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Bad request - missing required fields
 *       401:
 *         description: Unauthorized - token required
 *       409:
 *         description: Conflict - teacher already exists
 *       500:
 *         description: Internal server error
 */
router.post("/create-teacher", verifyToken,createTeacher);

module.exports = router;
