const express = require("express");
const router = express.Router();

const {
    addHR,
    getAllHR,
    updateHR,
    deleteHR,
    getRecentHR
} = require("../controllers/hrController");

router.post("/add", addHR);

router.get("/all", getAllHR);

router.put("/update/:id", updateHR);

router.delete("/delete/:id", deleteHR);
router.get("/recent", getRecentHR);

module.exports = router;