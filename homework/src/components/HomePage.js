import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {

  const backEndURL = process.env.REACT_APP_BACK_END_URL; // process.env.REACT_BACK_END_URL

  const navigate = useNavigate();
  const {currentUser} = useAuth(); 

  useEffect(() => {
      if(!currentUser) {
        navigate("/login")
      } 
  }, [currentUser])

  useEffect(() => {
    console.log("HERE")
    console.log(process.env.REACT_APP_BACK_END_URL); 
    const fetchData = async () => {
      //console.log(backEndURL); 
      if(currentUser.accessToken) {
        console.log("Exists QWQWDQW")
      } else {
        console.log("doesnt exist")
      }
      const tokenFormat = `Bearer ${currentUser.stsTokenManager.accessToken}`
      const headers = { 'Authorization': tokenFormat};
      const url = `${backEndURL}/${currentUser.email}` // `https://tpeo-todo.vercel.app/tasks/${currentUser.username}`
      const response = await fetch(url, {headers});
      const json = await response.json();

      const newData = [];
      for (let i = 0; i < json.length; i++) {
        newData.push({name: json[i].task, finished: json[i].finished, id: json[i].id})
      } 

      setTasks(newData);
    }

    fetchData(); 
  }, [])

  // State to hold the list of tasks.
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    for (let i = 0; i < tasks.length; i++) {
      if(tasks[i].finished) {
        // console.log(tasks[i].name)
        // console.log(tasks[i].id)
      }
    }
  }, [tasks])


  /*
  [
    // // Sample tasks to start with.
    // { name: "create a todo app", finished: false },
    // { name: "wear a mask", finished: false },
    // { name: "play roblox", finished: false },
    // { name: "be a winner", finished: true },
    // { name: "become a tech bro", finished: true },
  ]
  */
    async function addUserTask() {
        //const url = `http://localhost:3001/tasks`
        const data = {
          "user": currentUser.email,
          "task": taskName,
          "finished": false
        }; 
        const tokenFormat = `Bearer ${currentUser.stsTokenManager.accessToken}`
        const response = await fetch(backEndURL, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            'Authorization': tokenFormat
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), 
        });
        return response.json();
  }

  // State for the task name being entered by the user.
  const [taskName, setTaskName] = useState("");

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.

  async function addTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (taskName && !tasks.some((task) => task.name === taskName)) {

      // TODO: Support adding todo items to your todo list through the API.
      // In addition to updating the state directly, you should send a request
      // to the API to add a new task and then update the state based on the response.
      const data = await addUserTask();
      setTasks([...tasks, { name: taskName, finished: false, id: data.id}]);
      setTaskName("");
    } else if (tasks.some((task) => task.name === taskName)) {
      alert("Task already exists!");
    }
  }

  // Function to toggle the 'finished' status of a task.
  async function updateTask(name) {
    for(let i = 0; i < tasks.length; i++) {
      if(tasks[i].name === name) {
        const newArray = [...tasks];
        newArray[i].finished = !newArray[i].finished; 

        setTasks(newArray)

        const tokenFormat = `Bearer ${currentUser.stsTokenManager.accessToken}`
        const apiUrl = `${backEndURL}/${tasks[i].id}` // https://tpeo-todo.vercel.app/tasks/${tasks[i].id}
        const response = await fetch(apiUrl, { 
          method: 'DELETE', 
          headers: {
            "Content-Type": "application/json",
            'Authorization': tokenFormat
          },
        });

        const data = {
          "user": currentUser.email,
          "task": tasks[i].name,
          "finished": tasks[i].finished
        }; 
        const newResponse = await fetch(backEndURL, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            'Authorization': tokenFormat
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), 
        });

        const newJson = await newResponse.json();
        //console.log(newArray[i].id); 
        newArray[i].id = newJson.id; 
        //console.log(newArray[i].id); 

        setTasks(newArray); 
      }
    }
   
    // console.log(tasks)
    // setTasks(
    //   tasks.map((task) =>
    //     task.name === name ? { ...task, finished: !task.finished } : task
    //   )
    // );

    // // TODO: Support removing/checking off todo items in your todo list through the API.
    // // Similar to adding tasks, when checking off a task, you should send a request
    // // to the API to update the task's status and then update the state based on the response.
    // console.log("TASKSKSS")
    // console.log(tasks)

    // for(let i = 0; i < tasks.length; i++) {
    //   if(tasks[i].name === name) {
    //     const apiUrl = `https://tpeo-todo.vercel.app/tasks/${tasks[i].id}`
    //     const response = await fetch(apiUrl, { method: 'DELETE' });

    //     const url = `https://tpeo-todo.vercel.app/tasks`
    //     const data = {
    //       "user": "Shiv",
    //       "task": tasks[i].name,
    //       "finished": tasks[i].finished
    //     }; 
    //     const newResponse = await fetch(url, {
    //       method: "POST", // *GET, POST, PUT, DELETE, etc.
    //       mode: "cors", // no-cors, *cors, same-origin
    //       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //       credentials: "same-origin", // include, *same-origin, omit
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       redirect: "follow", // manual, *follow, error
    //       referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //       body: JSON.stringify(data), 
    //     });

    //     const newJson = await newResponse.json();
        
    //     const newArray = [...tasks];
    //     newArray[i].id = newJson.id; 

    //     setTasks(newArray); 

    //     console.log(tasks)
    //   }
    // }
  }

  // Function to compute a message indicating how many tasks are unfinished.
  function getSummary() {
    const unfinishedTasks = tasks.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getSummary()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={taskName}
                  placeholder="Type your task here"
                  onChange={(event) => setTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {tasks.map((task) => (
                <ListItem
                  key={task.name}
                  dense
                  onClick={() => updateTask(task.name)}
                > 
                  <Checkbox
                    checked={task.finished}
                  />
                  <ListItemText primary={task.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}
