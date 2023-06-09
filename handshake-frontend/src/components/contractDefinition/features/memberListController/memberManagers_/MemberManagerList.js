import MemberManagerInput from "./MemberManagerInput";
import { useSelector } from 'react-redux';

//MUI
import { Typography } from '@mui/material';

function MemberManagerList () {

    const members = useSelector((state) => {
        return state.memberList.memberList_;
    });

    const memberManagers = useSelector((state) => {
        return state.memberManagers.memberManagers_;
    });

    const isManager = (memberId) => {
        let manager = false;
        for (let memberManager of memberManagers) {
            if (memberId === memberManager) {
                manager = true;
                break;
            }
        }
        return manager;
    }

    let renderedMembers;

    if (members.length > 0) {
        renderedMembers = members.map((member) => {
            return (
                <div key={member._id}>
                    <MemberManagerInput member={member}
                                        isManager={isManager(member._id)}
                                        />
                </div>
            );
        });
    } else {
        renderedMembers = (
            <Typography color="red">
                Nenhum membro cadastrado no contrato ainda
            </Typography>
        );
    }

    return <div>
    <Typography>
        {`Selecione abaixo quais dos membros farão parte da comissão de administração do contrato.
        Apenas os membros da comissão podem incluir ou remover membros do contrato.`}
    </Typography>
    <p/>
    {renderedMembers}
</div>
}

export default MemberManagerList;