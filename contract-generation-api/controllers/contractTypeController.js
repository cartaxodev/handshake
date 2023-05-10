
const contractTypes =
[
    {
        id: 1,
        name: "Graduation Quota", 
        description: "Management of all financial aspects of a graduation celebration",
        source: "/concrete/GraduationQuota"
    },
    {
        id: 2,
        name: "Travel Quota", 
        description: "Management of all financial aspects of a group travel planning",
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