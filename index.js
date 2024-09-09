const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

const database = require("./config/database");
database.connect();

const Task = require("./models/task.model");

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    console.log(tasks);

    res.json(tasks);
});

app.get('/tasks/detail/:id', async (req, res) => {
    try {

        const id = req.params.id;

        const task = await Task.find({
            _id: id,
            deleted: false
        });
    
        res.json(task);
    } catch (error) {
        res.json({
            message: "Not found"
        });
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});