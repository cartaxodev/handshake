const express = require("express");
const contractTemplateController = require("./../controllers/contractTemplateController");

const router = express.Router();

router
    .route("/")
    //.get(contractTemplateController.getAllConcreteContracts)
    .post(contractTemplateController.saveConcreteContractTemplate);

router
    .route('/:networkId/:currencyId/:contractTypeId')
    .get(contractTemplateController.getContractTemplate);


module.exports = router;