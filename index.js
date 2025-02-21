require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');







app.use(cors())
app.use(express.json());






const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bpwxh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    const db = client.db('task-portal')
    const usersCollection = db.collection('users')
    const tasksCollection = db.collection('tasks')
    
   //get user data

   app.get('/users/:email',async (req, res) => {
      const { email } = req.params;
      
      try {
       
        const user = await usersCollection.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: "User not found " });
        }
    
        // Send the user data as the response
        res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    //update user info

    app.put('/users/:email', async (req, res) => {
      const { email } = req.params;
      const { name, photoURL } = req.body;
     
    
      // Check if the user exists in the database
      const existingUser = await usersCollection.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
    
      // Prepare the updated user data
      const updatedUser = {
        name: name || existingUser.name,
        image: photoURL || existingUser.image,
      };
    
      // Update the user's information
      await usersCollection.updateOne({ email }, { $set: updatedUser });
    
      res.status(200).json(updatedUser); // Send back the updated user data
    });

    //save user info
    app.post('/users/:email', async (req, res) => {
      
      const email = req.params.email
      console.log(email)
      const query = { email }
      const user = req.body
     
      //console.log(user)
      // check if user exists in db
      const isExist = await usersCollection.findOne(query)
      if (isExist) {
        return res.send(isExist)
      }
      const result = await usersCollection.insertOne({
        ...user,
        timestamp: Date.now(),
      })
      //console.log(result)
      res.send(result)
    })

    //get task data

    app.get('/tasks', async (req, res) => {


      const cursor = tasksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
})

// Update a task
app.put("/tasks/:id", async (req, res) => {
      const id  = req.params.id;
       // Exclude _id from the update payload
  const { _id, ...updatedTask } = req.body;

  updatedTask.timestamp = Date.now(); // Update timestamp

      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedTask }
      );

      if (result.modifiedCount === 1) {
        res.send({ message: "Task updated successfully", success: true });
      } else {
        res.status(404).send({ message: "Task not found", success: false });
      }
    });

  

    // Reorder tasks (update order field)
app.put('/tasks/reorder', async (req, res) => {
      const { tasks } = req.body;
    
      try {
        for (let i = 0; i < tasks.length; i++) {
          await tasksCollection.updateOne(
            { _id: new require('mongodb').ObjectId(tasks[i]._id) },
            { $set: { order: i } } // Update order for each task
          );
        }
        res.json({ message: 'Tasks reordered successfully' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });


// app.put("/tasks/reorder", async (req, res) => {
//       const { tasks } = req.body;
    
//       try {
//         if (!Array.isArray(tasks) || tasks.length === 0) {
//           return res.status(400).json({ message: "Invalid tasks data" });
//         }
    
//         for (let i = 0; i < tasks.length; i++) {
//           const taskId = tasks[i]._id;
          
//           // Check if taskId is valid
//           if (!taskId || typeof taskId !== "string" || taskId.length !== 24) {
//             console.error(`Invalid task ID received: ${taskId}`);
//             return res.status(400).json({ message: `Invalid task ID: ${taskId}` });
//           }
    
//           await tasksCollection.updateOne(
//             { _id: new ObjectId(taskId) },
//             { $set: { order: i } }  // Assign new order
//           );
//         }
    
//         res.json({ message: "Tasks reordered successfully" });
//       } catch (err) {
//         console.error("Error reordering tasks:", err);
//         res.status(500).json({ message: "Server error while reordering tasks" });
//       }
//     });

   

//delete task
app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await tasksCollection.deleteOne(query);
      console.log(result)
      res.send(result)

})

    //save task info
    app.post('/tasks', async (req, res) => {
      try {
            const tasks = req.body;
            
            

            
            const result = await tasksCollection.insertOne(
                  {
                        ...tasks,
                        timestamp: Date.now(),
                  }
            );
            res.send(result);
      } catch (error) {
            res.status(500).json({ message: "Error adding task", error });
      }
});
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
      res.send('TaskSync is running')
})

app.listen(port, () => {
      console.log(`This server is running on port:${port}`)
})