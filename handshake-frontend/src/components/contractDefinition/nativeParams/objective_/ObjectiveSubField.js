import { TextField } from "@mui/material";

function ObjectiveSubField({index, fieldName, handleSubFieldChange}) {
    
    const handleChange = (e) => {
        handleSubFieldChange(index, fieldName, e.target.value);
    }

    return <div>
        <p/>
        <TextField
            key={index}
            variant='outlined'
            fullWidth
            size="small"
            label={fieldName} 
            onChange={handleChange} 
        />
    </div>
}

export default ObjectiveSubField;