const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g7iiy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('database connected');

        const database = client.db('tour_baby');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('booking');
        const debitCardCollection = database.collection('debitCard')

        //get all package

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            console.log('services connected');
            res.send(services);
        });

        //get single package

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);

        })

        // post data

        app.post('/addbooking', async (req, res) => {
            console.log(req.body);
            const booking = req.body;
            console.log("post hitted", req.body)

            const result = await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result);

        })
        // get my bookings
        app.get("/myBookings/:email", async (req, res) => {
            const email = req.params.email;
            console.log('get my booking', email);
            const query = { email: req.params.email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })
        // delete booking
        app.delete("/deleteBooking/:id", async (req, res) => {
            const id = req.params.id;
            console.log(req.params.id);
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })
        // debit card information
        app.post('/debit', async (req, res) => {
            const debit = req.body;
            const result = await debitCardCollection.insertOne(debit);
            res.json(result);

        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running tour baby server')
});


app.listen(port, () => {
    console.log('running genius server on port', port)
})