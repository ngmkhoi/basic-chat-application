const express = require("express");
const {joiValidate} = require("../middlewares/joiValidate");
const {registerSchema, loginSchema} = require("../schemas/userSchema");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authRequired");
const router = express.Router();

router.post("/register", joiValidate(registerSchema), authController.createUser);
router.post("/login", joiValidate(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.getUserInfo);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/verify-email", authController.verifyEmail)
router.post("/resend-verify-token", authMiddleware ,authController.resendVerifyToken)

module.exports = router;