import express from "express";
import { userLoginHandler } from "../controllers/login.controller.js";
import { userLogoutHandler } from "../controllers/logout.controller.js";
import { refreshUserHandler } from "../controllers/refresh.controller.js";
import { updateProfileHandler } from "../controllers/updateProfile.controller.js";
import { userRegisterHandler } from "../controllers/register.controller.js";

export const userRouter = express.Router()

userRouter.post('/register', userRegisterHandler)
userRouter.post('/login', userLoginHandler)
userRouter.post('/logout', userLogoutHandler)
userRouter.post('/refesh', refreshUserHandler)
userRouter.post('/updateprofile', updateProfileHandler)