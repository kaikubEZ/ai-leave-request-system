import express from "express";

import * as tableController from "./tableController.js";

const router = express.Router();

router.get("/", tableController.home);
router.get("/api/timetable/:id", tableController.getTimeTable);
router.put("/api/timetable", tableController.updateTimeTable);
router.delete("/api/timetable/:id", tableController.deleteTable);
router.post("/api/absence", tableController.sendAbsenceMessage);

export default router;
