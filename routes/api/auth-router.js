const express = require("express");
const validateBody = require("../../utils/validateBody");
const { schemas } = require("../../models/user");
const { authenticate, upload } = require("../../middlewares");

const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth-controllers");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.usersSchema), register);
// signin
router.post("/login", validateBody(schemas.usersSchema), login);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(schemas.emailSchema), resendVerifyEmail);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
