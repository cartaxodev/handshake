const handshakeSuperClass = require('./contractControllers/handshakeSuperClass');
const memberListController = require('./contractControllers/featuresControllers/memberListController');
const depositScheduler = require('./contractControllers/featuresControllers/depositScheduler');
const withdrawalController = require('./contractControllers/featuresControllers/withdrawalController');


const concreteContractTemplates =
[
    {
        id: 1,
        name: "GraduationQuota_ETH",
        description: "Este contrato tem como objeto a gestão coletiva dos recursos financeiros"
                    + " necessários à realização de festa de formatura",
        objectiveFields: [
            "Instituição de ensino",
            "Curso",
            "Turma"
        ],
        nativeParamsFunction: handshakeSuperClass.getConstructorParams,
        // featuresParamsFunctions: [
        //     memberListController.getConstructorParams,
        //     depositScheduler.getConstructorParams,
        //     withdrawalController.getConstructorParams
        // ],
        // featuresParams: []
        features: [
            "memberListController",
            "depositScheduler",
            "withdrawalController"
        ]
    },
    {
        id: 2,
        name: "GraduationQuota_ERC20",
        description: "Este contrato tem como objeto a gestão coletiva dos recursos financeiros"
                    + " necessários à realização de festa de formatura",
        objectiveFields: [
            "Instituição de ensino",
            "Curso",
            "Turma"
        ],
        nativeParamsFunction: handshakeSuperClass.getConstructorParams,
        // featuresParamsFunctions: [
        //     memberListController.getConstructorParams,
        //     depositScheduler.getConstructorParams,
        //     withdrawalController.getConstructorParams
        // ],
        // featuresParams: []
        features: [
            "memberListController",
            "depositScheduler",
            "withdrawalController"
        ]
    },
    {
        id: 3,
        name: "TravelQuota_ETH",
        description: "Este contrato tem como objeto a gestão coletiva dos recursos financeiros"
                    + " necessários à realização de viagem em grupo",
        objectiveFields: [
            "Local"
        ],
        nativeParamsFunction: handshakeSuperClass.getConstructorParams,
        // featuresParamsFunctions: [
        //     memberListController.getConstructorParams,
        //     depositScheduler.getConstructorParams,
        //     withdrawalController.getConstructorParams
        // ],
        // featuresParams: []
        features: [
            "memberListController",
            "depositScheduler",
            "withdrawalController"
        ]
    },
    {
        id: 4,
        name: "TravelQuota_ERC20",
        description: "Este contrato tem como objeto a gestão coletiva dos recursos financeiros"
                    + " necessários à realização de viagem em grupo",
        objectiveFields: [
            "Local"
        ],
        nativeParamsFunction: handshakeSuperClass.getConstructorParams,
        // featuresParamsFunctions: [
        //     memberListController.getConstructorParams,
        //     depositScheduler.getConstructorParams,
        //     withdrawalController.getConstructorParams
        // ],
        // featuresParams: []
        features: [
            "memberListController",
            "depositScheduler",
            "withdrawalController"
        ]
    },
];

/* Returns contract template */
exports.getContractTemplate = ((req, res) => {

    let contractTemplateId;

    /* Rules to define wich concreteContract corresponds to chosen params */
    if ((req.params.networkId === '1')) {

        if ((req.params.currencyId) === '1') {

            if ((req.params.contractTypeId) === '1') {
                contractTemplateId = 1;
            }

            else if ((req.params.contractTypeId) === '2') {
                contractTemplateId = 3;
            }
        } 

        else if ((req.params.currencyId) === '2') {

            if ((req.params.contractTypeId) === '1') {
                contractTemplateId = 2;
            }

            else if ((req.params.contractTypeId) === '2') {
                contractTemplateId = 4;
            }
        }

        else {
            res.status(404).json({
                message: "This contract template is not available"
            });
            return;
        }

    } else {
        res.status(404).json({
            message: "This network is not available"
        });
        return;
    }

    const contractTemplate = concreteContractTemplates.find(el => el.id === contractTemplateId);
    const response = JSON.parse(JSON.stringify(contractTemplate));
    delete response.featuresParamsFunctions;
    delete response.nativeParamsFunctions;

    response.nativeParams = contractTemplate.nativeParamsFunction();
    // for (featureFunction of contractTemplate.featuresParamsFunctions) {
    //     const featureParams = featureFunction();
    //     for (param of featureParams) {
    //         response.featuresParams.push(param);
    //     }
    // }

    res.status(200).json({
        contractTemplate: response
    })
});

/*  */
exports.saveConcreteContractTemplate = ((req, res) => {

    //TODO
});