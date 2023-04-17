const express = require(express);

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use((req, res, next) => {
    console.log("Hello from the test middleware");
    next();
});


//ROUTES


module.exports = app;