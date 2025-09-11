export const home = async (req, res) => {
    console.log("getTimeTable");
    res.status(500).json({ message: "OK" });
};
export const getTimeTable = async (req, res) => {
    console.log("getTimeTable");
    let id = req.params.id
    console.log(id)
    res.status(500).json({ message: "OK" });
};
export const updateTimeTable = async (req, res) => {
    console.log("updateTimeTable");
    //console.log(req.body);
    let id = req.body.studentId;
    let timeTable = req.body.timetable;
    console.log(id);
    console.log(timeTable);
    res.status(500).json({ message: "OK" });
};
export const deleteTable = async (req, res) => {
    console.log("deleteTable");
    let id = req.params.id
    console.log(id)
    res.status(500).json({ message: "OK" });
};
export const sendAbsenceMessage = async (req, res) => {
    console.log("sendAbsenceMessage");
    //console.log(req.body);
    let id = req.body.studentId;
    let day = req.body.day;
    let reason = req.body.reason;
    console.log(`${id} ${day} ${reason}`);
    res.status(500).json({ message: "OK" });
};