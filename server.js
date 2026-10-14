
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('pub'));

mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const Student = mongoose.model('Student', {
    name: String,
    department: String,
    mark: Number
});

app.get('/students', async (req, res) => {
    res.json(await Student.find());
});

app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: 'Invalid student ID' });
    }
});

app.post('/students', async (req, res) => {
    const student = await Student.create(req.body);
    res.json(student);
});

app.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: 'Invalid student ID or data' });
    }
});

app.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid student ID' });
    }
});

app.listen(8080, () => {
    console.log('Server running at http://localhost:8080');
});
