import { Router } from "express";
import { createTransaction, getAllTransaction } from "../controller/TransactionController.js";
import { createCashRequest, getAllCashRequests } from "../controller/CashRequestController.js";
import { getBalanceSummary } from "./SummuryController.js";

const router = Router();


router.post('/', createTransaction)
router.get('/all', getAllTransaction)
router.post('/cash-request', createCashRequest)
router.get('/cash-request', getAllCashRequests)
router.get('/summury', getBalanceSummary)
// router.put('/cash-request', )


export default router;