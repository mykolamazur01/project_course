import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControl } from '@mui/material';
import axios from 'axios';

const CharacteristicsEditDialog = ({onClose}) => {
    
    const [open, setOpen] = useState(false);
    const [characteristics, setCharacteristics] = useState([]);

    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const characteristicRes = await axios.get('http://localhost:5000/characteristic');
                setCharacteristics(characteristicRes.data.items);
            } catch (error) {
                console.error('Error fetching characteristic data:', error);
            }
        };
        fetchCharacteristics();
    }, []);

    const handleOpen = () => {
        console.log(characteristics);
        console.log(Array.isArray(characteristics));
        setOpen(true);
    };

    const handleCharacteristicChange = (characteristic, name) => {
        setCharacteristics((prev) => {
            return prev.map((item) => {
                if (item.characteristic_id === characteristic.characteristic_id) {
                    return {...item, name: name};
                }
                return item;
            });
        
        });
    };

    const deleteCharacteristicHandler = (name) => {
        setCharacteristics((prevCharacteristics) => {
            return prevCharacteristics.filter((element) => {
                return element.name !== name;
            })
        })
    }

    const handleSave = () => {
        console.log(characteristics);
        setOpen(false);
    };

    const addCharacteristicHandler = () => {
        setCharacteristics((prevCharacteristics) => {
            return [...prevCharacteristics, {
                characteristic_id: prevCharacteristics.sort((a, b) => b.characteristic_id - a.characteristic_id)[0].characteristic_id + 1,
                name: ''
            }]
        });
    }

    return (
        <>
        <Button onClick={handleOpen}>Edit Characteristics</Button>
        <Dialog open={open}>
            <DialogTitle>Edit Characteristic</DialogTitle>
            <DialogContent>
                {characteristics.map((characteristic) => {
                    return (
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <FormControl key={characteristic.characteristic_id} sx={{ m: 1, minWidth: 150, display: "flex", justifyContent: "center" }}>
                            
                            <TextField
                                label='Characteristic'
                                value={characteristic.name}
                                onChange={(e) => handleCharacteristicChange(characteristic, e.target.value)}
                            />
                            <Button onClick={(event) => {deleteCharacteristicHandler(characteristic.name)}} color='error'>Delete characteristic</Button>   
                        </FormControl>
                        </Box> 
                    )
                })}   
                <Button onClick={addCharacteristicHandler} color="primary">Add characteristic</Button>    
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default CharacteristicsEditDialog;