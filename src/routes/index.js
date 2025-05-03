import { Router } from "express";
import userRouter from './userRoutes.js'
import transactionRouter from './transactionRotes.js'
import cashRequestRouter from './CashRequestRoutes.js'
import widthDrawRouter from './withDrawRoutes.js'



const router = Router();

router.use('/user',userRouter);
router.use('/transaction', transactionRouter);
router.use('/cash-request', cashRequestRouter);
router.use('/widthDraw', widthDrawRouter)



export default router;