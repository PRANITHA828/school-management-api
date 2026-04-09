const db = require("../database");
const getDistance = require("../utils/distance");


//  ADD SCHOOL
const addSchool = (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const stmt = db.prepare(`
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, address, lat, lon);

    return res.status(201).json({
      message: "School added successfully",
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("ADD ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



//  LIST SCHOOLS (SORT BY DISTANCE)
const listSchools = (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({
        message: "Invalid coordinates",
      });
    }

    const rows = db.prepare("SELECT * FROM schools").all();

    const schoolsWithDistance = rows.map((school) => {
      const distance = getDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance: Number(distance.toFixed(2)),
      };
    });

    // Sort nearest first
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    return res.json(schoolsWithDistance);
  } catch (error) {
    console.error("LIST ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};






module.exports = {
  addSchool,
  listSchools,
};