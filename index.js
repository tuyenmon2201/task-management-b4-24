const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;

const database = require("./config/database");
database.connect();

const routesApi = require("./routes/client/index.route");

// parser application/json
app.use(bodyParser.json());

routesApi(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});