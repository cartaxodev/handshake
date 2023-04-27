const express = require("express");
const contractTypeController = require("./../controllers/contractTypeController");

const router = express.Router();

router
    .route("/")
    .get(contractTypeController.getAllContractTypes);

router
    .route('/:id')
    .get(contractTypeController.getContractType);


module.exports = router;