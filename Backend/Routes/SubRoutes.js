import express from "express";
import { createSubscription } from "../Controllers/subscriptionController.js";
import { AdminAuth } from "../Middleweres/AdminAuth.js";

const router = express.Router();

router.post("/subscribe", AdminAuth, createSubscription);

export default router;
