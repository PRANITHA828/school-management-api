const express = require("express");
const app = express();
require("./configs/db");

const PORT = process.env.MYSQLPORT || 5000;

const schoolRoutes = require("./routes/schoolroutes");

app.use(express.json());
app.use("/", schoolRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

