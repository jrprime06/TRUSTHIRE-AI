const express = require("express");

const router = express.Router();

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage
});

const {

    createJob,

    getJobs,

    deleteJob,

    updateJob,

    viewPDF

} = require("../controllers/jobController");

router.get("/", getJobs);

router.post(

    "/",

    upload.single("pdf"),

    createJob

);

router.put(

    "/:id",

    upload.single("pdf"),

    updateJob

);

router.delete("/:id", deleteJob);

router.get("/pdf/:id", viewPDF);

module.exports = router;