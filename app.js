const express = require("express");
const app = express();
require("./configs/db");

const PORT = process.env.PORT || 5000;

const schoolRoutes = require("./routes/schoolroutes");

app.use(express.json());
app.use("/", schoolRoutes);



app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/test", (req, res) => {
  res.send("API working ");
});