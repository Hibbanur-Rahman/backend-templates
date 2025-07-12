const express = require('express');

const { getAllSystemActivityLogs } = require('../controller/systemActivityController');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SystemActivityLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the activity log
 *         activityType:
 *           type: string
 *           description: Type of activity performed
 *         description:
 *           type: string
 *           description: Description of the activity
 *         userRole:
 *           type: string
 *           description: Role of the user who performed the activity
 *         userId:
 *           type: string
 *           description: ID of the user who performed the activity
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the activity occurred
 */

/**
 * @swagger
 * /system-activity-logs:
 *   get:
 *     summary: Get all system activity logs
 *     tags: [System Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System activity logs retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SystemActivityLog'
 *       401:
 *         description: Unauthorized - token required
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllSystemActivityLogs);

module.exports = router;
