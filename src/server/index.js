// Setup empty JS object to act as endpoint for all routes
projectData = {};

// require dot-env, fetch, path, body-parser modules
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const path = require("path");
const bodyParser = require("body-parser");

// require express, mock-api modules
const express = require("express");

dotenv.config();

console.log(`Your API key is ${process.env.API_KEY}`);

// Start up an instance of app
const app = express();

// Initialize the main project folder
app.use(express.static("dist"));

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// GET route
app.get("/all", (req, res) => {
  res.send(projectData);
});

// POST an entry route
app.post("/addEntry", addEntry);

function addEntry(req, res) {
  //projectData.push(req.body);
  projectData = req.body;
}

// POST route to communicate with geonames
app.post("/geonames", async (req, res) => {
  let data = req.body;
  const requestOptions = {
    method: "POST",
  };
  console.log(data);
  const apiKey = process.env.API_KEY_GEONAMES;
  const userInput = data.location;
  // call fetch on API url, then process response and send to client.
  const result = await fetch(
    `http://api.geonames.org/searchJSON?style=full&maxRows=12&name_startsWith=${userInput}&username=${apiKey}`,
    requestOptions
  ).then((result) => result.json().then((data) => res.send(data)));
});

// POST route to communicate with weatherbit
app.post("/weatherbit", async (req, res) => {
  let data = req.body;
  const requestOptions = {
    method: "POST",
  };
  console.log(data);
  const apiKey = process.env.API_KEY_WEATHERBIT;
  const lat = data.lat;
  const lng = data.lng;
  // call fetch on API url, then process response and send to client.
  const result = await fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${apiKey}&include=minutely`,
    requestOptions
  ).then((result) => result.json().then((data) => res.send(data)));
});

// POST route to communicate with pixabay
app.post("/pixabay", async (req, res) => {
  let data = req.body;
  const requestOptions = {
    method: "POST",
  };
  console.log(data);
  const apiKey = process.env.API_KEY_PIXABAY;
  const userInput = data.dest;
  // call fetch on API url, then process response and send to client.
  const result = await fetch(
    `https://pixabay.com/api/?key=${apiKey}&q=${userInput}&image_type=photo`,
    requestOptions
  ).then((result) => result.json().then((data) => res.send(data)));
});

// Setup Server
const port = 8000;
const server = app.listen(port, listening);

function listening() {
  console.log("server running");
  console.log(`running on localhost: ${port}`);
}
