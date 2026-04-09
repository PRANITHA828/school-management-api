const db = require("../database");
const getDistance = require("../utils/distance");


// ADD SCHOOL
const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || !address || latitude == null || longitude == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const query = `
    INSERT INTO schools (name, address, latitude, longitude)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [name, address, latitude, longitude], function (err) {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(201).json({
      message: "School added successfully",
      id: this.lastID,
    });
  });
};


//  LIST SCHOOLS (SORT BY DISTANCE)
const listSchools = (req, res) => {
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

  db.all("SELECT * FROM schools", [], (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    const schoolsWithDistance = rows.map((school) => {
      const distance = getDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance: parseFloat(distance.toFixed(2)),
      };
    });

    // Sort by nearest
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    return res.json(schoolsWithDistance);
  });
};


// UPDATE SCHOOL
const updateSchool = (req, res) => {
  const { id } = req.params;
  const { name, address, latitude, longitude } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  if (!name || !address || latitude == null || longitude == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const query = `
    UPDATE schools 
    SET name=?, address=?, latitude=?, longitude=? 
    WHERE id=?
  `;

  db.run(
    query,
    [name, address, latitude, longitude, id],
    function (err) {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "School not found" });
      }

      return res.json({
        message: "School updated successfully",
      });
    }
  );
};


module.exports = {
  addSchool,
  listSchools,
  updateSchool,
};