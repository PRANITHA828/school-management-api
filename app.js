const express = require("express");
const app = express();
require("./configs/db");

const schoolRoutes = require("./routes/schoolroutes");

app.use(express.json());
app.use("/", schoolRoutes);




app.listen(5000, () => {
  console.log("Server running on port 5000");
});