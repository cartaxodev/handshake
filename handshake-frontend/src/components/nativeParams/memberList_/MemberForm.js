import { useDispatch, useSelector } from "react-redux";
import { removeMember, changeMemberLogin, changeMemberMainAddress } from "../../../store";

//MUI
import { TextField, Typography, Button, Card } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete'

function MemberForm ({ memberId }) {

    const dispatch = useDispatch();
    const member = useSelector((state) => {
        const members = state.memberList.memberList_;
        for (let m of members) {
            if (m._id === memberId) {
                return m;
            }
        }
    })

    const handleLoginChange = (e) => {

        dispatch(changeMemberLogin({
            _id: memberId,
            _login: e.target.value
        }));
    }

    const handleAddressChange = (e) => {

        dispatch(changeMemberMainAddress({
            _id: memberId,
            _mainAddress: e.target.value
        }))
    }

    const handleRemove = (e) => {
        dispatch(removeMember(memberId));
    }

    return <div>
            <Card spacing={1}>
                <Typography>
                    <p>ID: {memberId}</p>
                </Typography>

                <TextField
                    required
                    label="Login"
                    size="small"
                    defaultValue=""
                    value={member._login}
                    onChange={handleLoginChange}
                />

                <TextField
                    required
                    label="Wallet address"
                    size="small"
                    defaultValue=""
                    value={member._mainAddress}
                    onChange={handleAddressChange}
                />

                <Button
                    size="small"
                    variant="text"
                    onClick={handleRemove}>
                        <DeleteIcon 
                            fontSize="small"
                            color="error"/>
                </Button>
            </Card>
    </div>

}

export default MemberForm;