const db = require("../configs/db");
const getDistance = require("../utils/distance");

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

  //  Fetch all schools
  const query = "SELECT * FROM schools";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    // Add distance to each school
    const schoolsWithDistance = results.map((school) => {
      const distance = getDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance: parseFloat(distance.toFixed(2)), // rounded
      };
    });

    // Sort by nearest first
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  });
};

const addSchool = async (req, res) => {
  try {
    console.log("API HIT");

    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const query =
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

    const [result] = await db.query(query, [
      name,
      address,
      latitude,
      longitude,
    ]);

    return res.json({
      message: "School added successfully ",
      id: result.insertId,
    });
  } catch (err) {
    console.log("ERROR ", err);
    return res.status(500).json({ error: err.message });
  }
};

//  Update School
const updateSchool = (req, res) => {
  const { id } = req.params;
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || !address || latitude == null || longitude == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const query =
    "UPDATE schools SET name=?, address=?, latitude=?, longitude=? WHERE id=?";

  db.query(
    query,
    [name, address, latitude, longitude, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "School not found" });
      }

      res.json({ message: "School updated successfully " });
    }
  );
};

module.exports = { addSchool, listSchools, updateSchool };

