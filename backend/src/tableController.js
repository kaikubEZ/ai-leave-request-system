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
        console.log(typeof(content.candidates)+": ");
        console.log(content.candidates);
        console.log(typeof(content.candidates[0])+": ");
        console.log(content.candidates[0]);
        console.log(typeof(content.candidates[0].content)+": ");
        console.log(content.candidates[0].content);
        res.status(200).json({contents: content.candidates[0].content.parts[0].text});
    }
    catch(error){
        console.log(error);
        res.status(200).json({contents: content.candidates[0].content.parts[0].text});
    }
    /* let mes = {
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Dear Sir/Madam,\n\nI am writing to request a leave of absence from school on Thursday, October 26, 2023, due to a severe headache. My student ID is 111222.\n\nThe following classes will be affected by my absence:\n\n*   Period 1: Science, taught by John Green (JoGreen@gmail.com)\n*   Period 2: Mathematics, taught by Kayle Laurent (Klaurent@gmail.com)\n\nI will make every effort to catch up on any missed work and assignments as soon as possible upon my return. I have also notified the relevant teachers about my absence.\n\nThank you for your understanding and consideration.\n\nSincerely,\n\n[Your Name]\n"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "avgLogprobs": -0.14031470514112904
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 96,
    "candidatesTokenCount": 155,
    "totalTokenCount": 251,
    "promptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 96
      }
    ],
    "candidatesTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 155
      }
    ]
  },
  "modelVersion": "gemini-2.0-flash",
  "responseId": "TMbGaJ7AKKugz7IP_IbCyQk"
};
    res.status(200).json({contents: mes.candidates[0].content.parts[0].text}); */

};
