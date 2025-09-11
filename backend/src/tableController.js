import TimeTable from "./tableModel.js";

export const home = async (req, res) => {
    console.log("getTimeTable");
    res.status(500).json({ message: "OK" });
};
export const getTimeTable = async (req, res) => {
    console.log("getTimeTable");
    let id = req.params.id;
    console.log(id);
    try{
        let table = await TimeTable.findOne({studentId:id});
        console.log(table);
        res.status(200).json(table);
    }
    catch{
        res.status(500).json({ message: "cannot find" });
    }
};
export const updateTimeTable = async (req, res) => {
    console.log("updateTimeTable");
    //console.log(req.body);
    let id = req.body.studentId;
    let timeTable = req.body.timetable;
    console.log(id);
    console.log(timeTable);

    let temp = await TimeTable.find();
    console.log(temp); //test db
    
    try{
        await TimeTable.updateOne({studentId:id}, {$set:{timeTable:timeTable}});
        let table = await TimeTable.findOne({studentId:id});
        console.log(table);
        res.status(200).json(table);
    }
    catch{
        try{
            await TimeTable.insertOne({studentId:id, timetable:timeTable});
            let table = await TimeTable.findOne({studentId:id});
            console.log("insert:"+table);
            res.status(200).json(table);
        }catch{
            res.status(500).json({ message: "cannot add" });
        }
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