import express from "express";

import * as itemController from "./itemController.js";

const router = express.Router();

router.get("/", itemController.home);
router.get("/api/timetable/:id", itemController.getTimeTable);
router.put("/api/timetable", itemController.updateTimeTable);
router.delete("/api/timetable/:id", itemController.deleteTable);
router.post("/api/absence", itemController.sendAbsenceMessage);

export default router;
