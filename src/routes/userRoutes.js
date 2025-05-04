import { Router } from "express";
import { getAllUsers, getUserController, login, logout, register } from "../controller/authController.js";
import { updateAgentApprovalStatus, updateUserActiveStatus } from "../controller/userController.js";
import { getBalanceSummary } from "./SummuryController.js";
import { isAdmin, verifyToken } from "../middleware/middleware.js";

const router = Router();




router.post('/register', register);
router.post('/login', login)
router.get('/', verifyToken,isAdmin, getAllUsers)
router.post('/logout', logout)
router.get('/getUserOne', getUserController)
router.patch('/update',verifyToken,isAdmin, updateUserActiveStatus)
router.patch('/update-agent',verifyToken,isAdmin, updateAgentApprovalStatus)
router.get('/summury',verifyToken,isAdmin, getBalanceSummary)

export default router
