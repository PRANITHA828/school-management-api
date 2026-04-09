const express = require("express");
const router = express.Router();

const { addSchool, listSchools, updateSchool,addScoo} = require("../controllers/schoolcontroller");


router.get("/listSchools", listSchools);
router.post("/addSchool", addSchool);
router.put("/updateSchool/:id", updateSchool);
router.post("/addScoo", addScoo);

module.exports = router;

