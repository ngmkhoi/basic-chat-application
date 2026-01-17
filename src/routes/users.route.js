const express = require("express");
const usersController = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/authRequired");
const router = express.Router();

router.get("/search", authMiddleware, usersController.search);

module.exports = router;