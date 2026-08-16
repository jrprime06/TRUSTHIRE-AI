// backend/routes/users.js

const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/usersController");

router.post("/register", registerUser);

module.exports = router;