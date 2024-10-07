const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

const matronControllers = require("./controllers/matronControllers")
const busControllers = require("./controllers/busControllers")
const driverControllers = require("./controllers/driverControllers")
const parentControllers =  require("./controllers/parentControllers")
const studentControllers =require('./controllers/studentController')

app.use(cors());
app.use(express.json());
app.use("/matrons", matronControllers);
app.use("/bus", busControllers )
app.use('/drivers', driverControllers)
app.use("/parents", parentControllers)
app.use("/students", studentControllers)

app.use("/static", express.static(path.join(__dirname, "public")));

app.get('/', (request, response) => {
    response.status(200).json({ data: 'Service is running!'});
  });
  
module.exports = app;
