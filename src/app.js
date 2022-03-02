const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const { fetchUpdate, insertData, updateData } = require("./services");

const cron = require("node-cron");

const port = 3005;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to API Covid Indonesia");
});

// This endpoint will call fetchUpdate function from services to get data from the database
app.get("/updates", fetchUpdate);

// This endpoint will execute insertData function from services to save data to the database
app.post("/additional", insertData);

// This is a cron job, set to every 11:59 PM. this will update the database if there is a change in Public API
cron.schedule("*/1 * * * *", updateData);

app.listen(port, () => {
  console.log(`App berjalan di port ${port}`);

  updateData(new Date());
});
