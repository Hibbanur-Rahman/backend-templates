const SystemActivityLog = require("../models/systemActivityLog");

const logSystemActivity = async (action, performedBy, performedByRole) => {
  try {
    const log = new SystemActivityLog({
      action,
      performedBy,
      performedByRole
    });
    await log.save();
  } catch (error) {
    console.error('Error logging system activity:', error);
  }
};

module.exports = logSystemActivity; 