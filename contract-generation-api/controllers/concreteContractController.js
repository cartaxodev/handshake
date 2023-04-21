
const concreteContractTemplates =
[
    {
        id: 1,
        name: "GraduationQuota_ETH",
        nativeParams: [
            {
                name: "objective",
                valueType: "string",
                value: "",
                question: {
                    eng: `What is the specific objective of this contract.
                            You should inform the institution name, the course, the class, and other relevant information.`,
                    pt_br: `Qual é o objetivo específico deste contrato de cota para festa de graduação?
                            Informe detalhes sobre a instituição de ensino, o curso, a turma, etc.`
                },
                optionized: false,
                options: [],
                multipleValues: false,
                multipleValuesConfig: {
                    min: 0,
                    max: 0
                }
            },
            {
                name: "memberList",
                valueType: "member",
                value: {
                    login: "",
                    mainAddress: "",
                    secondaryAddresses: []
                },
                question: {
                    eng: `Who are the members of this contract?
                            You should inform the login of each member.
                            If the member has not signed up on this platform yet, you should inform the e-mail and the wallet address of the member.`,
                    pt_br: `Quem são os membros deste contrato?
                            Você deve informar o login de cada membro.
                            Se o membro ainda não possuir login na plataforma, você deve informar o e-mail de contato e o endereço da wallet `
                },
                optionized: false,
                options: [],
                multipleValues: true,
                multipleValuesConfig: {
                    min: 2,
                    max: 100
                }
            },
        ]
    },
    {
        id: 2,
        name: "GraduationQuota_ERC20", 
    },
    {
        id: 3,
        name: "TravelQuota_ETH", 
    },
    {
        id: 4,
        name: "TravelQuota_ERC20", 
    },
];

/* Returns contract template */
exports.getConcreteContractTemplate = ((req, res) => {

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

    res.status(200).json({
        contractTemplate
    })
});

/*  */
exports.saveConcreteContractTemplate = ((req, res) => {

    //TODO
});