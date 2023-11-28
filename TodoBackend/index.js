const express = require("express"); 
var cors = require('cors')
const app = express(); 

var admin = require("firebase-admin");
const db = require('./firebase')

const tasksCollection = db.collection('Tasks');

app.use(express.json()); 
app.use(cors()); 


function auth(req, res, next) {
    try {
        const tokenId = req.get("Authorization").split("Bearer ")[1];
        admin.auth().verifyIdToken(tokenId)
          .then((decoded) => {
            req.token = decoded;
            next();
          })
          .catch((error) => res.status(401).send(error));
      } catch (error) {
        res.status(400).send("Invalid token");
      }
}

app.use(auth); 

app.get("/tasks", async (req, res) => {
    const allUserTasks = []; 

    const snapshot = await tasksCollection.get();
    snapshot.forEach(doc => {
        const data = doc.data(); 
        allUserTasks.push({...data, id: doc.id}); 
    });
    res.send(allUserTasks); 

})

app.get("/tasks/:username", async (req, res) => {
    const allUserTasks = []; 
    const usernameParam = req.params.username;

    const snapshot = await tasksCollection.get();
    snapshot.forEach(doc => {
        const data = doc.data(); 
        if(data.user === usernameParam) {
            allUserTasks.push({...data, id: doc.id}); 
        }
    });
    res.send(allUserTasks); 
})

app.post("/tasks", async (req, res) => {
    const result = await tasksCollection.add(req.body);
    const returnJSON = {...req.body, id: result.id}; 
    res.send(returnJSON); 
})

app.delete("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const docRef = tasksCollection.doc(id);
    const doc = await docRef.get();
    const data = doc.data(); 
    const returnVal = {...data, id: doc.id}; 

    const deleteDoc = await tasksCollection.doc(id).delete();

    res.send(returnVal);
})

app.listen(3001, () => {console.log("Listening on Port 3001")})

