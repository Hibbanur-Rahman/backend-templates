const httpStatusCode = require("../constant/httpStatusCode");
const SystemActivityModel = require("../models/systemActivityLog");
const getAllSystemActivityLogs = async (req, res) => {
  try {
    const systemActivityLogs = await SystemActivityModel.find().populate(
      "performedBy",
      "username role _id email"
    ).sort({ createdAt: -1 });
    if (!systemActivityLogs) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "No system activity logs found",
      });
    }
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "System activity logs fetched successfully",
      data: systemActivityLogs,
    });
  } catch (error) {
    console.log("error while getting all system activity logs:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { getAllSystemActivityLogs };
