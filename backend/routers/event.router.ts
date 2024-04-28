import { Router } from "express";
import { createEvent, getEvents, getEventDetail, updateEvent, deleteEvent, getEventStats } from "../controllers/event.controller"

const router = Router();

router.get("/", getEvents)
router.get("/:id", getEventDetail)
router.get("/stats/all", getEventStats)
router.post("/", createEvent)
router.patch("/:id", updateEvent)
router.delete("/:id", deleteEvent)

export default router