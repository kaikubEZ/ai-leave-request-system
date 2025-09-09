import express from "express";

import * as itemController from "./itemController.js";

const router = express.Router();

router.get("/api/timetable", itemController.getTimeTable);
router.put("/api/timetable", itemController.updateTimeTable);
router.delete("/api/timetable", itemController.deleteTable);
router.post("/api/absence", itemController.sendAbsenceMessage);

export default router;
