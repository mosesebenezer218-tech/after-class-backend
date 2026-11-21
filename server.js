const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logger middleware: prints every request to the server console
app.use((req, res, next) => {
    console.log(new Date().toISOString() + ' - ' + req.method + ' ' + req.url);
    next();
});

// Connection string for MongoDB Atlas
const client = new MongoClient("mongodb+srv://mosesebenezer218_db_user:uAQ7BmXQ6lp5z81d@cluster0.0yj0zlt.mongodb.net/");
let db;

async function connectTOMongoDB() {
    try {
        await client.connect();
        db = client.db('afterschool');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.dir(error);
    }
}

connectTOMongoDB();

// Static file middleware: serves lesson images from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// If the image file was not found above, send an error message instead
app.use('/images', (req, res) => {
    res.status(404).json({ error: 'Image not found' });
});

// GET /lessons - returns all the lessons as JSON
app.get('/lessons', async (req, res) => {
    try {
        const lessons = await db.collection('lesson').find({}).toArray();
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: 'Could not get lessons' });
    }
});

// POST /orders - saves a new order to the "order" collection
app.post('/orders', async (req, res) => {
    try {
        const order = {
            name: req.body.name,
            phone: req.body.phone,
            lessonIDs: req.body.lessonIDs,
            spaces: req.body.spaces
        };

        const result = await db.collection('order').insertOne(order);
        res.status(201).json({ message: 'Order saved', orderId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Could not save order' });
    }
});

// PUT /lessons/:id - updates any attribute(s) of one lesson (e.g. space, price)
app.put('/lessons/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid lesson id' });
        }

        const result = await db.collection('lesson').updateOne(
            { _id: new ObjectId(req.params.id) },   // which lesson to change
            { $set: req.body }                      // the new values sent in the body
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json({ message: 'Lesson updated' });
    } catch (error) {
        res.status(500).json({ error: 'Could not update lesson' });
    }
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});