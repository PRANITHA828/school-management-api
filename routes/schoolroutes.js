const express = require("express");
const router = express.Router();

const { addSchool, listSchools, updateSchool,} = require("../controllers/schoolcontroller");


router.get("/listSchools", listSchools);
router.post("/addSchool", addSchool);
router.put("/updateSchool/:id", updateSchool);

module.exports = router;

