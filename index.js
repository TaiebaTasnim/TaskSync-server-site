require('dotenv').config()
const express = require('express');
const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');
const app = express();

const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Create HTTP server
//const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
// const io = socketIo(server, {
//   cors: {
//     origin: "*", // Allow any origin, adjust as needed
//     methods: ["GET", "POST"]
//   }
// });





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

    app.get("/tasks/:email", async (req, res) => {
      const { email } = req.params;
      const query = { Useremail: email };
      const tasks = await tasksCollection.find(query).toArray();

      // Sort tasks by category and order
      const sortedTasks = tasks.sort((a, b) => a.order - b.order);
      res.send(sortedTasks);
    });


// Update a task
 // Update a task (e.g., title, description, category, or order)
 app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      console.log(updatedTask);
      const query = { _id: new ObjectId(id) };
      console.log(query);

      const update = {
        $set: {
          title: updatedTask.title,
          description: updatedTask.description,
          category: updatedTask.category,
          order: updatedTask.order,
          timestamp: Date.now()
        },
      };

      const result = await tasksCollection.updateOne(query, update);
      console.log(result);
      res.send(result);
    });
// app.put("/tasks/:id", async (req, res) => {
//       const id = req.params.id;
    
//       // Validate the task ID
//       if (!ObjectId.isValid(id)) {
//         return res.status(400).send({ message: "Invalid task ID", success: false });
//       }
    
//       // Exclude _id from the update payload
//       const { _id, ...updatedTask } = req.body;
//       updatedTask.timestamp = Date.now(); // Update timestamp
    
//       try {
//         // Update the task in the database
//         const result = await tasksCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updatedTask }
//         );
    
//         if (result.modifiedCount === 1) {
//           // Fetch the updated task from the database
//           const updatedDocument = await tasksCollection.findOne({ _id: new ObjectId(id) });
    
//           // Send the updated task (including _id) back to the client
//           res.send({
//             message: "Task updated successfully",
//             success: true,
//             task: updatedDocument, // Include the full task object with _id
//           });
//         } else {
//           res.status(404).send({ message: "Task not found", success: false });
//         }
//       } catch (err) {
//         console.error("Error updating task:", err);
//         res.status(500).send({ message: "Server error while updating task", success: false });
//       }
//     });

    app.post("/tasks/reorder", async (req, res) => {
      const { sourceCategory, destinationCategory, sourceIndex, destinationIndex, taskId } = req.body;
    
      try {
        // Find the task being moved
        const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
    
        if (!task) {
          return res.status(404).send({ message: "Task not found" });
        }
    
        // If the task is moved within the same category
        if (sourceCategory === destinationCategory) {
          // Get all tasks in the category, sorted by order
          const tasksInCategory = await tasksCollection
            .find({ category: sourceCategory })
            .sort({ order: 1 })
            .toArray();
    
          // Remove the task from its current position
          tasksInCategory.splice(sourceIndex, 1);
    
          // Insert the task at the new position
          tasksInCategory.splice(destinationIndex, 0, task);
    
          // Update the order of all tasks in the category
          for (let i = 0; i < tasksInCategory.length; i++) {
            await tasksCollection.updateOne(
              { _id: tasksInCategory[i]._id },
              { $set: { order: i } }
            );
          }
        } else {
          // If the task is moved to a different category
    
          // Step 1: Remove the task from the source category
          await tasksCollection.updateMany(
            { category: sourceCategory, order: { $gt: sourceIndex } },
            { $inc: { order: -1 } }
          );
    
          // Step 2: Make space in the destination category
          await tasksCollection.updateMany(
            { category: destinationCategory, order: { $gte: destinationIndex } },
            { $inc: { order: 1 } }
          );
    
          // Step 3: Update the task's category and order
          await tasksCollection.updateOne(
            { _id: new ObjectId(taskId) },
            { $set: { category: destinationCategory, order: destinationIndex } }
          );
        }
    
        res.send({ message: "Task reordered successfully" });
      } catch (error) {
        console.error("Error reordering tasks:", error);
        res.status(500).send({ message: "Failed to reorder tasks" });
      }
    });
  

// Reorder tasks
// app.put("/tasks/reorder", async (req, res) => {
//       const { tasks } = req.body;

//       try {
//         if (!Array.isArray(tasks)) {
//           return res.status(400).json({ message: "Invalid tasks data" });
//         }

//         for (let i = 0; i < tasks.length; i++) {
//           const taskId = tasks[i]._id;
//           if (!ObjectId.isValid(taskId)) {
//             return res.status(400).json({ message: `Invalid task ID: ${taskId}` });
//           }

//           await tasksCollection.updateOne(
//             { _id: new ObjectId(taskId) },
//             { $set: { order: i } }
//           );
//         }

//         res.json({ message: "Tasks reordered successfully" });
//       } catch (err) {
//         console.error("Error reordering tasks:", err);
//         res.status(500).json({ message: "Server error while reordering tasks" });
//       }
//     });

    // Update task category
//     app.put("/tasks1/:id", async (req, res) => {
//       const id = req.params.id;
//       const { category } = req.body;

//       if (!ObjectId.isValid(id)) {
//         return res.status(400).json({ message: "Invalid task ID" });
//       }

//       try {
//         const result = await tasksCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: { category } }
//         );

//         if (result.modifiedCount === 1) {
//           res.json({ message: "Task category updated successfully" });
//         } else {
//           res.status(404).json({ message: "Task not found" });
//         }
//       } catch (err) {
//         console.error("Error updating task category:", err);
//         res.status(500).json({ message: "Server error while updating task category" });
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
      //io.emit('taskDeleted', { taskId: id });

})

    //save task info
//     app.post('/tasks', async (req, res) => {
//       try {
//             const tasks = req.body;
            
            

            
//             const result = await tasksCollection.insertOne(
//                   {
//                         ...tasks,
//                         timestamp: Date.now(),
//                   }
//             );
//             res.send(result);
//             //io.emit('taskCreated', { task: tasks });
//       } catch (error) {
//             res.status(500).json({ message: "Error adding task", error });
//       }
// });

app.post("/tasks", async (req, res) => {
      const task = req.body;
    
      // Validate required fields
      if (!task.title || !task.category) {
        return res.status(400).send({ message: "Title and category are required", success: false });
      }
    
      // Set initial order (last in the category)
      try {
        const lastTaskInCategory = await tasksCollection
          .find({ category: task.category })
          .sort({ order: -1 })
          .limit(1)
          .toArray();
    
        task.order = lastTaskInCategory.length > 0 ? lastTaskInCategory[0].order + 1 : 0;
    
        // Insert the new task into the database
        const result = await tasksCollection.insertOne(task);
    
        // Send a success response with the inserted ID
        res.send({
          message: "Task created successfully",
          success: true,
          insertedId: result.insertedId,
        });
      } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).send({ message: "Server error while creating task", success: false });
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