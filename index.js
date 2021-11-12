const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l9s2s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log("Database Connected successfuylly")
        const database = client.db("actionShark");
        const productsCollection = database.collection("products");
        const usersCollection = database.collection('users');
        const orderCollection = database.collection('orders');
        //geting all product from database
        app.get('/products', async (req, res) => {
            const query = productsCollection.find({});
            const result = await query.toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        app.put('/users', async (req, res) => {

            const email = req.body.email;
            const user = req.body;
            const displayName = req.body.displayName;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    email: email,
                    displayName: displayName,
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);




        })


        //make an admin
        app.put('/users/admin', async (req, res) => {

            const user = req.body;
            console.log(req);

            const filter = { email: user.email };

            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // add product
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })

        //getting single products
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query)
            res.send(result);
        })
        //place order
        app.post('/placeorder', async (req, res) => {
            const neworder = req.body;
            const result = await orderCollection.insertOne(neworder);
            res.json(result);
        })


        //my order
        app.get("/myorder/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        })


        // delete a single order
        app.delete("/deleteorder/:id", async (req, res) => {
            console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        //display all user order
        app.get('/allorders', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //  update order Status
        app.put("/orderstatus/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const updateDoc = {
                $set: {
                    orderstatus: "Confirmed"
                },
            };

            const result = await orderCollection.updateOne(query, updateDoc);
            res.json(result);
        });

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Action Shark')
})


app.listen(port, () => {
    console.log(`listening at :${port}`)
})