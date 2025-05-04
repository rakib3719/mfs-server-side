import { Router } from "express";
import { createWithdraw, getAllWithdrawRequests, updateWithdrawRequest } from "../controller/widthDrawController.js";
import { isAdmin, isAgent, verifyToken } from "../middleware/middleware.js";


const router = Router();

router.post('/',verifyToken,isAgent, createWithdraw)
router.get('/',verifyToken, getAllWithdrawRequests)
router.put('/',verifyToken,isAdmin, updateWithdrawRequest )



export default router;