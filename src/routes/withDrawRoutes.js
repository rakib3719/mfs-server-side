import { Router } from "express";
import { createWithdraw, getAllWithdrawRequests, updateWithdrawRequest } from "../controller/widthDrawController.js";


const router = Router();

router.post('/', createWithdraw)
router.get('/', getAllWithdrawRequests)
router.put('/', updateWithdrawRequest )



export default router;