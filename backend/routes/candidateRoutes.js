const express = require("express");

const router = express.Router();

const {

    getCandidates,

    getCandidate,

    getPhoto,

    deleteCandidate

} = require("../controllers/candidateController");

router.get("/", getCandidates);

router.get("/:id", getCandidate);



router.delete("/:id", deleteCandidate);

module.exports = router;