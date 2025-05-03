import { Router } from "express";
import { createCashRequest, getAllCashRequests, updateCashRequest } from "../controller/CashRequestController.js"

const router = Router();


router.post('/create', createCashRequest);
router.get('/', getAllCashRequests)
router.put('/update', updateCashRequest)

export default router;