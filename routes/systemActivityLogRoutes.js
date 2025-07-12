const express = require('express');

const { getAllSystemActivityLogs } = require('../controller/systemActivityController');
const router = express.Router();
router.get('/', getAllSystemActivityLogs);
export default router;
