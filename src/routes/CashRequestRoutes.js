import { Router } from "express";
import { createCashRequest, getAllCashRequests, updateCashRequest } from "../controller/CashRequestController.js"
import { isAdmin, isAgent, verifyToken } from "../middleware/middleware.js";

const router = Router();


router.post('/create',verifyToken,isAgent, createCashRequest);
router.get('/',verifyToken, getAllCashRequests)
router.put('/update',verifyToken, isAdmin, updateCashRequest)

export default router;