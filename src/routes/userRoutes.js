import { Router } from "express";
import { getAllUsers, getUserController, login, logout, register } from "../controller/authController.js";
import { updateAgentApprovalStatus, updateUserActiveStatus } from "../controller/userController.js";
import { getBalanceSummary } from "./SummuryController.js";

const router = Router();




router.post('/register', register);
router.post('/login', login)
router.get('/', getAllUsers)
router.post('/logout', logout)
router.get('/getUserOne', getUserController)
router.patch('/update', updateUserActiveStatus)
router.patch('/update-agent', updateAgentApprovalStatus)
router.get('/summury',getBalanceSummary)

export default router
