import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import axios from 'axios';
import fetchSubtypes from '../InstrumentCard/helper/fetchSubtypes';
import fetchSingleSubtype from '../InstrumentCard/helper/fetchSingleSubtype';

const SubtypeEditDialog = ({onClose}) => {
    
    const [open, setOpen] = useState(false);
    const [subtypes, setSubtypes] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {

        const fetchSubtypesRes = async () => {
            try {
                const subtypes = await fetchSubtypes();
                const subtypesRes = await Promise.all(subtypes.map(async (subtype) => {
                    const fullSubtype = await fetchSingleSubtype(subtype.instrument_subtype_id);
                    return fullSubtype;
                }));
                setSubtypes(subtypesRes);
                const data = await axios.get('http://localhost:5000/instrument_type');
                setTypes(data.data.items);
            } catch (error) {
                console.error('Error fetching subtypes:', error);
            }
        }
        fetchSubtypesRes();

    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleSubtypeChange = (subtype, name) => {
        setSubtypes((prev) => {
            return prev.map((item) => {
                if (item.instuent_subtype_id === subtype.instuent_subtype_id) {
                    return {...item, name: name};
                }
                return item;
            });
        
        });
    };

    const deleteSubtypeHandler = (name) => {
        setSubtypes((prevSubtypes) => {
            return prevSubtypes.filter((element) => {
                return element.name !== name;
            })
        })
    }

    const handleOpenType = async (event) => {
        
    }

    const handleSave = () => {
        setOpen(false);
        console.log(subtypes);
        console.log(types);
        
        //onClose();
    };

    const addSubtypeHandler = () => {
        setSubtypes((prevSubtypes) => {
            return [...prevSubtypes, {
                instrument_subtype_id: prevSubtypes.sort((a, b) => b.instrument_subtype_id - a.instrument_subtype_id)[0].instrument_subtype_id + 1,
                name: '',
                instrument_type_id: 0
            }]
        });
    }

    return (
        <>
        <Button onClick={handleOpen}>Edit Subtypes</Button>
        <Dialog open={open}>
            <DialogTitle>Edit Subtypes</DialogTitle>
            <DialogContent>
                {subtypes.map((subtype) => {
                    return (
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <FormControl key={subtype.instrument_subtype_id} sx={{ m: 1, minWidth: 150, display: "flex", justifyContent: "center" }}>
                            
                            <TextField
                                label='Subtype'
                                value={subtype.name}
                                onChange={(e) => handleSubtypeChange(subtype, e.target.value)}
                            />
                            <Select
                                labelId="country-select-label"
                                id="country-select"
                                label="Countries"
                                value={subtype.instrument_type_id.name}
                                onChange={
                                    (event) => {
                                        setSubtypes((prev) => {
                                            return prev.map((item) => {
                                                if (item.name === subtype.name) {
                                                    return {...item, instrument_type_id: {name: event.target.value, ...item.instrument_type_id}};
                                                }
                                                return item;
                                        });
                                    })
                                }}
                                onOpen={handleOpenType}
                            >
                                {types.map((type) => (
                                    
                                    <MenuItem key={type?.instrument_type_id} value={type?.name}>
                                        {type?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button onClick={(event) => {deleteSubtypeHandler(subtype.name)}} color='error'>Delete subtype</Button>   
                        </FormControl>
                        </Box> 
                    )})} 
                <Button onClick={addSubtypeHandler} color="primary">Add subtype</Button>    
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default SubtypeEditDialog;