// TODO 4: Create and design member model (think about the fields you need)
// e.g. const Member = mongoose.model(...);
import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  type: Object,
  required: false,
  
});

const timeTable = mongoose.model("timeTable", tableSchema);


export default timeTable;
