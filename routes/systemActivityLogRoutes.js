const express = require('express');

const { getSystemActivity } = require('../controller/systemActivityController');
const router = express.Router();
router.get('/', authenticateToken, checkRole(['admin']), getSystemActivity);
export default router;
