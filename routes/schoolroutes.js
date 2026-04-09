const express = require("express");
const router = express.Router();

const { addSchool, listSchools} = require("../controllers/schoolcontroller");


router.get("/listSchools", listSchools);
router.post("/addSchool", addSchool);



module.exports = router;

