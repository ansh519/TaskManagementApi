const Task = require('../models/Task');

const createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, userId: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const { status, dueDate, sort = 'createdAt', order = 'asc', page = 1, limit = 10 } = req.query;

        const filter = { userId: req.user.id };
        if (status) filter.status = status;
        if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

        const sortOrder = order === 'desc' ? -1 : 1;

        const tasks = await Task.find(filter)
            .sort({ [sort]: sortOrder })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const totalTasks = await Task.countDocuments(filter);

        res.status(200).json({
            tasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: parseInt(page),
            totalTasks,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
