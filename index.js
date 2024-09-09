const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

const database = require("./config/database");
database.connect();

const routesApi = require("./routes/client/index.route");

routesApi(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});