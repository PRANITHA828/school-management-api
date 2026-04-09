const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;



app.use(express.json());




app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

