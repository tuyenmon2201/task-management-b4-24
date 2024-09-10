const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;

app.use(cors());

// const corsOptions = {
//   origin: 'http://abc.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions));

const database = require("./config/database");
database.connect();

const routesApi = require("./routes/client/index.route");

// parser application/json
app.use(bodyParser.json());

routesApi(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});