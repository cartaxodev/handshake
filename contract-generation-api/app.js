const express = require("express");
const cors = require('cors');
//const morgan = require("morgan");
const contractTypeRouter = require("./routes/contractTypeRoutes");
const contractTemplateRouter = require("./routes/contractTemplateRoutes");

const app = express();

//MIDDLEWARES
app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log("Hello from the test middleware");
    next();
});


//ROUTES
app.use("/api/v1/contractType", contractTypeRouter);
app.use("/api/v1/contractTemplate", contractTemplateRouter);


module.exports = app;