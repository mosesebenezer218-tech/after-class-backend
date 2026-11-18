// Run this ONCE to put the 10 lessons into MongoDB Atlas: node seed.js
const { MongoClient } = require("mongodb");

const lessons = [
    { topic: "Football",      location: "Sports Field",        price: 250, space: 5, image: "football.jpg" },
    { topic: "Basketball",    location: "Sports Hall",         price: 300, space: 5, image: "basketball.jpg" },
    { topic: "Tennis",        location: "Tennis Court",        price: 350, space: 5, image: "tennis.jpg" },
    { topic: "Swimming",      location: "Swimming Pool",       price: 400, space: 5, image: "swimming.jpg" },
    { topic: "Badminton",     location: "Indoor Sports Hall",  price: 250, space: 5, image: "badminton.jpg" },
    { topic: "Karate",        location: "Martial Arts Studio", price: 300, space: 5, image: "karate.jpg" },
    { topic: "Gymnastics",    location: "Gymnastics Centre",   price: 350, space: 5, image: "gymnastics.jpg" },
    { topic: "Volleyball",    location: "Sports Hall",         price: 250, space: 5, image: "volleyball.jpg" },
    { topic: "Music Classes", location: "Music Room",          price: 200, space: 5, image: "music.jpg" },
    { topic: "Arts & Crafts", location: "Art Studio",          price: 200, space: 5, image: "artcrafts.jpg" }
];

async function seed() {
    const client = new MongoClient("mongodb+srv://mosesebenezer218_db_user:uAQ7BmXQ6lp5z81d@cluster0.0yj0zlt.mongodb.net/");
    await client.connect();

    const collection = client.db("afterschool").collection("lesson");
    await collection.deleteMany({});           // clear old data so we never get duplicates
    await collection.insertMany(lessons);      // add the 10 lessons

    console.log("Inserted " + lessons.length + " lessons");
    await client.close();
}

seed();