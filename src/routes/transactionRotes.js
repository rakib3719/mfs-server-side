import { Router } from "express";
import { createTransaction, getAllTransaction } from "../controller/TransactionController.js";
import { createCashRequest, getAllCashRequests } from "../controller/CashRequestController.js";
import { getBalanceSummary } from "./SummuryController.js";
import { isAdmin, isAgent, verifyToken } from "../middleware/middleware.js";

const router = Router();


router.post('/',verifyToken, createTransaction)
router.get('/all',verifyToken, getAllTransaction)
router.post('/cash-request',verifyToken,isAgent, createCashRequest)
router.get('/cash-request',verifyToken, getAllCashRequests)
router.get('/summury',verifyToken,isAdmin, getBalanceSummary)
// router.put('/cash-request', )


export default router;