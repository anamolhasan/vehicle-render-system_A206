import { Router } from "express";
import { userController } from "./user.controller.js";
import auth from "../../middleware/auth.js";
import { role } from "../../utils/role.js";




const router = Router();

router.get('/',auth(role.admin),  userController.getAllUser)
router.put('/:id',auth(role.admin), userController.updateUser)
router.delete('/:id',auth(role.admin), userController.deleteUser)


export const userRouter = router