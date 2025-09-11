import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  studentId:{
    type: Number,
    required: true
  },
  timetable:{
    type: Object,
    required: true,
  }
});

const TimeTable = mongoose.model("timeTable", tableSchema);


export default TimeTable;
