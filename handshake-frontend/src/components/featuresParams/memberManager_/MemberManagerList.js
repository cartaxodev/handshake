import MemberManagerInput from "./MemberManagerInput";


function MemberManagerList ({ members, state, setState }) {

    const managersToRemove = [];
    for (let memberManager of state) {
        
        let memberFound = false;
        for (let member of members) {
            if (memberManager._id === member._id) {
                memberFound = true;
            }
        }
        if (!memberFound) {
            managersToRemove.push(memberManager);
        }
    }

    if (managersToRemove.length > 0) {
        const memberManagers = state.filter((memberManager) => {
            let remove = false;
            for (let m of managersToRemove) {
                if (memberManager._id === m._id) {
                    remove = true;
                }
            }
            return !remove;
        });
        setState("memberManagers_", memberManagers);
    }
    
    const addMemberManager = (memberId) => {
        const memberManagers = [];
        for (let memberManager of state) {
            memberManagers.push(memberManager);
        }

        for (let member of members) {
            if (member._id === memberId) {
                memberManagers.push({
                    _id: memberId
                });
            }
        }

        setState("memberManagers_", memberManagers);
    }

    const removeMemberManager = (memberId) => {
        const memberManagers = state.filter((memberManager) => {
            return (memberManager._id !== memberId);
        });

        setState("memberManagers_", memberManagers);
    }

    const isManager = (memberId) => {
        let manager = false;
        for (let memberManager of state) {
            if (memberId === memberManager._id) {
                manager = true;
                break;
            }
        }
        return manager;
    }

    let renderedMembers;
    
    if (members !== "") {
        renderedMembers = members.map((member) => {
            return (
                <div key={member._id}>
                   <MemberManagerInput member={member}
                                       isManager={isManager(member._id)}
                                       addMemberManager={addMemberManager}
                                       removeMemberManager={removeMemberManager}
                                       />
                </div>
            );
        });
    }

    return (
        <div>
            <p>Selecione abaixo quais dos membros farão parte da comissão de administração do contrato:</p>
            {renderedMembers}
        </div>
    );
}

export default MemberManagerList;