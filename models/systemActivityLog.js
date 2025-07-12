const mongoose = require("mongoose");
const SystemActivityLogSchema=new mongoose.Schema({
    activityType:{
        type:String,
        required:true
    },
    activityDescription:{
        type:String,
        required:true
    },
    performedByRole:{
        type:String,
        required:false
    },
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        refPath: "performedByRole",
        required:false
    },
    

},{
    timestamps:true
})

const SystemActivityLog=mongoose.model("SystemActivityLog",SystemActivityLogSchema);
module.exports=SystemActivityLog;