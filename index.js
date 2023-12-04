const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const app = express();
const port = process.env.PORT || 5000;

// Middleware

const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
  }
  
  app.use(cors(corsOptions))
  app.use(express.json());

  



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.ggegvme.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      
        const contactCollection = client.db("redDropDb").collection("contact");
      const blogCollection = client.db("redDropDb").collection("blog");
      const userCollection = client.db("redDropDb").collection("users");
      const districtCollection = client.db("redDropDb").collection("district");
      const upazilaCollection = client.db("redDropDb").collection("upazila");
      const newDonationRequestCollection = client.db("redDropDb").collection("newDonationRequest");

      app.get("/district", async (req, res) => {
        const cursor = districtCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

      app.get("/upazila", async (req, res) => {
        const cursor = upazilaCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      }); 
//users related API
   
      app.get('/allUsers', async (req, res) => {
        const result = await userCollection.find().toArray();
  res.send(result);
});   
      
      
app.post("/users", async (req, res) => {
  const user = req.body;

  //insert email if user not exist
  const query = { email: user.email }
  const existingUser = await userCollection.findOne(query)
  if (existingUser) {
    return res.send({message: 'user already existingUser', insertedId: null})
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
});
      
      //add blog in dashboard content management
app.post("/addBlog", async (req, res) => {
  const newBlog = req.body;
  const result = await blogCollection.insertOne(newBlog);
  res.send(result);
});

      
      //Delete user from dashboard
app.delete('/allUsers/:Id', async (req, res) => {
  const Id = req.params.Id;
   const idObject = new ObjectId(Id)
  console.log(Id);
  const result = await userCollection.deleteOne({ _id: idObject });
  console.log(result);
  res.send(result);
  
});
      
      
      
      //Delete donation request single data from my donation request page in donor dashboard
app.delete('/deleteDonationData/:Id', async (req, res) => {
  const Id = req.params.Id;
   const idObject = new ObjectId(Id)
  console.log(Id);
  const result = await newDonationRequestCollection.deleteOne({ _id: idObject });
  console.log(result);
  res.send(result);
  
});
      
      


//for contact form
app.post("/contact", async (req, res) => {
    const newContact = req.body;
    const result = await contactCollection.insertOne(newContact);
    res.send(result);
  });

      
      
      
      //api of create new donation request by donor


      app.get("/CreateDonation", async (req, res) => {
        const cursor = newDonationRequestCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

      app.post("/CreateDonation", async (req, res) => {
        const createNewDonationRequest = req.body;
        const result = await newDonationRequestCollection.insertOne(createNewDonationRequest);
        res.send(result);
      });

        
        //blog field

        app.get("/blog", async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
          });

      
      //update operation
// app.get('/updateUserInfo/:_id', async (req, res) => {  
//   const updateProductId = req.params._id;
//   const idObject = new ObjectId(updateProductId)
//   const result = await productCollection.findOne( idObject );
//   res.send(result); 
//   console.log(idObject);
// })
    

app.put('/updateUserInfo/:_id', async (req, res) => {
  const updateId = req.params._id;
  const updateInfo = req.body;
  const filter = {_id: new ObjectId(updateId)}
  const options = { upsert: true };
  const updateUserElement = {
    $set: {
      status: updateInfo.status,
      role: updateInfo.role,
    }
  }
    console.log(updateInfo); 

const result = await userCollection.updateOne(filter, updateUserElement, options)
  res.send(result); 
  console.log(result);
})




    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Red Drop server is running');
});

app.listen(port, () => {
    console.log(`Red Drop server is running on port: ${port}`);
});