import MemberManagerInput from "./MemberManagerInput";
import { useSelector } from 'react-redux';


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

    let renderedMembers = members.map((member) => {
        return (
            <div key={member._id}>
                <MemberManagerInput member={member}
                                    isManager={isManager(member._id)}
                                    />
            </div>
        );
    });

    return (
        <div>
            <p>Selecione abaixo quais dos membros farão parte da comissão de administração do contrato:</p>
            {renderedMembers}
        </div>
    );
}

export default MemberManagerList;