
const contractTypes =
[
    {
        id: 1,
        name: "Cota de formatura", 
        description: "Template de contrato de gestão financeira para realização de festa de formatura",
        source: "/concrete/GraduationQuota"
    },
    {
        id: 2,
        name: "Cota de viagem", 
        description: "Template de contrato de gestão financeira para planejamento e realização de viagem em grupo",
        source: "/concrete/TravelQuota"
    },
];


/* Returns all available contract types */
exports.getAllContractTypes = ((req, res) => {

    const types = [];

    for (contractType of contractTypes) {

        types.push({
            id: contractType.id,
            name: contractType.name,
            description: contractType.description
        });
    }

    res.status(200).json({
        contractTypes: types
    });
});

/* Returns contract type by ID */
exports.getContractType = ((req, res) => {

    const id = req.params.id * 1;
    const contractType = contractTypes.find(el => el.id === id);

    const response = {
        id: contractType.id,
        name: contractType.name,
        description: contractType.description
    }

    res.status(200).json({
        contractType: response
    })
});