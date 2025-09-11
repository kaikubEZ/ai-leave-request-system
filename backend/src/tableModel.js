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

const timeTable = mongoose.model("timeTable", tableSchema);


export default timeTable;
