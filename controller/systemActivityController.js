const SystemActivityLog = require("../models/systemActivityLog");

const logSystemActivity = async (action, performedBy, performedByRole) => {
  try {
    const role = performedByRole === "admin" ? "Admin" : "Employee";
    const log = new SystemActivityLog({
      action,
      performedBy,
      performedByRole: role,
    });
    await log.save();
  } catch (error) {
    console.error("Error logging system activity:", error);
  }
};

const getSystemActivity = async (req, res) => {
  try {
    const logs = await SystemActivityLog.find()
      .populate("performedBy","name username fullName role")
      .sort({ createdAt: -1 });
    if (!logs) {
      return res.status(400).json({
        success: false,
        message: "No logs found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
      error: error.message,
    });
  }
};

module.exports = { logSystemActivity, getSystemActivity };
