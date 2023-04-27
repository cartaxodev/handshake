const express = require("express");
//const morgan = require("morgan");
const contractTypeRouter = require("./routes/contractTypeRoutes");
const concreteContractRouter = require("./routes/concreteContractRoutes");

const app = express();

//MIDDLEWARES
app.use(express.json());

app.use((req, res, next) => {
    console.log("Hello from the test middleware");
    next();
});


//ROUTES
app.use("/api/v1/contract-type", contractTypeRouter);
app.use("/api/v1/concrete-contract", concreteContractRouter);


module.exports = app;