

function WithdrawalApproverInput ({ member, isApprover, addWithdrawalApprover, removeWithdrawalApprover }) {

    const handleCheckboxChange = (e) => {

        if (isApprover === false) {
            addWithdrawalApprover(Number(e.target.value));
        }
        else {
            removeWithdrawalApprover(Number(e.target.value));
        }
    }

    return (
        <div>
            {member._login}: 
            <input type="checkbox" 
                   onChange={handleCheckboxChange}
                   value={member._id}
                   checked={isApprover}>
            </input>
        </div>
    );
}

export default WithdrawalApproverInput;