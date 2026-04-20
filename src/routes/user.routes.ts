import express from "express";
import { userLoginHandler } from "../controllers/login.controller.js";
import { userLogoutHandler } from "../controllers/logout.controller.js";
import { refreshUserHandler } from "../controllers/refresh.controller.js";
import { updateProfileHandler } from "../controllers/updateProfile.controller.js";
import { userRegisterHandler } from "../controllers/register.controller.js";
import { getProfileHandler } from "../controllers/getProfile.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const userRouter = express.Router()

userRouter.post('/register', userRegisterHandler)
userRouter.post('/login', userLoginHandler)
userRouter.post('/logout', authenticate, userLogoutHandler)
userRouter.post('/refresh', authenticate, refreshUserHandler)
userRouter.post('/updateprofile', authenticate, updateProfileHandler)
userRouter.get("/me", authenticate, getProfileHandler)