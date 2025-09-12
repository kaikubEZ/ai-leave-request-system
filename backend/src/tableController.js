import TimeTable from "./tableModel.js";

export const home = async (req, res) => {
    console.log("getTimeTable");
    res.status(500).json({ message: "OK" });
};
export const getTimeTable = async (req, res) => {
    console.log("getTimeTable");
    const id = req.params.id;
    console.log(id);
    const tables = await TimeTable.findOne({studentId:id});
    console.log(tables);
    if(tables==null){
        res.status(500).json({ message: "cannot find" });
    }
    else{
        res.status(200).json(tables);
    }
};
export const updateTimeTable = async (req, res) => {
    console.log("updateTimeTable");
    //console.log(req.body);
    const id = req.body.studentId;
    const timeTables = req.body.timetable;
    console.log(id);
    console.log(timeTables);

    const tableexist = await TimeTable.findOne({studentId:id});
    console.log(tableexist);
    if(tableexist!=null){
        console.log("already exist");
        const result = await TimeTable.updateOne({studentId:id}, {$set:{timeTable:timeTables}});
        console.log(result);
        res.status(200).json(result);
    }
    else{
        console.log("not exist");
        const result = await TimeTable.create({studentId:id, timetable:timeTables});
        const table = await TimeTable.findOne({studentId:id});
        console.log(result);
        console.log("insert:"+table);
        res.status(200).json(result);
    }
};
export const deleteTable = async (req, res) => {
    console.log("deleteTable");
    let id = req.params.id;
    //to do
    console.log(id);
    res.status(500).json({ message: "OK" });
};
export const sendAbsenceMessage = async (req, res) => {
    console.log("sendAbsenceMessage");
    //to do
    let id = req.body.studentId;
    let day = req.body.day;
    let reason = req.body.reason;
    console.log(`${id} ${day} ${reason}`);
    res.status(500).json({ message: "OK" });
};