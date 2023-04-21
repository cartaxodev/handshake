const express = require("express");
const concreteContractController = require("./../controllers/concreteContractController");

const router = express.Router();

router
    .route("/")
    //.get(concreteContractController.getAllConcreteContracts)
    .post(concreteContractController.saveConcreteContractTemplate);

router
    .route('/:networkId/:currencyId/:contractTypeId')
    .get(concreteContractController.getConcreteContractTemplate);


module.exports = router;