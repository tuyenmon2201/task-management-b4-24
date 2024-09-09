const Task = require("../../models/task.model");

module.exports.index = async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    console.log(tasks);

    res.json(tasks);
}

module.exports.detail = async (req, res) => {
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
}