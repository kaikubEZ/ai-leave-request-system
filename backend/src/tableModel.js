import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  studentId:{
    type: Number,
    required: false
  },
  timetable:{
    type: mongoose.SchemaTypes.Mixed,
    required: false
  }
});

const TimeTable = mongoose.model("timeTable", tableSchema);


export default TimeTable;
