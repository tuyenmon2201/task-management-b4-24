const Task = require("../../models/task.model");

module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    // Filter by status

    const status = req.query.status;
    if(status){
        find.status = status;
    }
    // End filter by status

    // Sort

    const sort = {};

    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    if(sortKey && sortValue){
        sort[sortKey] = sortValue;
    }
    // End sort

    // Pagination

    let limitItems = 2;
    if(req.query.limitItems){
        limitItems = parseInt(req.query.limitItems);
    }

    let page = 1;
    if(req.query.page){
        page = parseInt(req.query.page);
    }

    const skip = (page - 1) * limitItems;

    // End pagination

    // Search
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // End search

    const tasks = await Task
        .find(find)
        .limit(limitItems)
        .skip(skip)
        .sort(sort);

    // console.log(tasks);

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

module.exports.changeStatus = async (req, res) => {
    try {

        const ids = req.body.ids;

        const status = req.body.status;

        await Task.updateMany({
            _id: { $in: ids }
        }, {
            status: status
        });

        res.json({
            message: "Cập nhật dữ liệu thành công!"
        });

    } catch (error) {
        res.json({
            message: "Not found"
        });
    }
}

module.exports.create = async (req, res) => {
    try {

        const task = new Task(req.body);

        await task.save();

        res.json({
            message: "Tạo công việc thành công!",
            task: task
        });

    } catch (error) {
        res.json({
            message: "Not found"
        });
    }
}