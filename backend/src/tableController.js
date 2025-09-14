import TimeTable from "./tableModel.js";
import { createEmail } from "./bashAi.js";
import { json } from "express";

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
        const result = await TimeTable.updateOne({studentId:id}, {timetable:timeTables});
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
    const result = await TimeTable.deleteOne({studentId:id});
    console.log(result);
    res.status(200).json({ message: result});
};
export const sendAbsenceMessage = async (req, res) => {
    console.log("sendAbsenceMessage");
    //to do
    // console.log(req.body);
    let id = req.body.studentId;
    let day = req.body.day;
    let reason = req.body.reason;
    let affectedClasses = req.body.affectedClasses;
    console.log(`${id} ${day} ${reason} ${affectedClasses}`);
    console.log(affectedClasses);
    let content = await createEmail(id, day, reason, affectedClasses);
    console.log(typeof(content)+": "+content);
    try{
        console.log(typeof(content.candidates)+": "+content.candidates);
        console.log(typeof(content.candidates[0])+": "+content.candidates[0]);
        console.log(typeof(content.candidates[0].content)+": "+content.candidates[0].content);
        res.status(200).json(content);
    }
    catch(error){
        console.log(error);
        res.status(200).json(content);
    }
};
