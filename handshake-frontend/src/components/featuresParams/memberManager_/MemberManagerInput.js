

function MemberManagerInput ({ member, isManager, addMemberManager, removeMemberManager }) {

    const handleCheckboxChange = (e) => {

        if (isManager === false) {
            addMemberManager(Number(e.target.value));
        }
        else {
            removeMemberManager(Number(e.target.value));
        }
    }

    return (
        <div>
            {member._login}: 
            <input type="checkbox" 
                   onChange={handleCheckboxChange}
                   value={member._id}
                   checked={isManager}>
            </input>
        </div>
    );
}

export default MemberManagerInput;