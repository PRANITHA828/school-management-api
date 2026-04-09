const express = require("express");
const app = express();
const schoolRoutes = require("./routes/schoolroutes");


const PORT = process.env.PORT || 5000;



app.use(express.json());

app.use("/", schoolRoutes);

app.get("/", (req, res) => {
  res.send("Server working ");
});


app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

