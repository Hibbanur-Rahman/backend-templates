const mongoose = require("mongoose");
const systemActivityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: false,
    },
    activityType: {
        type: String,
        required: false,
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "performedByRole",
        required: false,
    },
    performedByRole:{
        type: String,
        required: false,
    },
},{
    timestamps: true,
});

const SystemActivityLog = mongoose.model("SystemActivityLog", systemActivityLogSchema);
module.exports = SystemActivityLog;